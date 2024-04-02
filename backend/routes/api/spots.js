const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

//GET all Spots
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({});
    const listOfSpotsJSON = [];
    spots.forEach((spot) => {
        listOfSpotsJSON.push(spot.toJSON())
    });


    for(let spot of listOfSpotsJSON){
        const reviews = await Review.count({
            where: {
                spotId: spot.id
            }
        });
        const totalStars = await Review.sum('stars', {
            where: {
                spotId: spot.id
            }
        });

        spot.avgRating = (totalStars / reviews);

        let preview = await SpotImage.findOne({
            where: {
                spotId : spot.id,
                preview : true
            }
        })

        if(preview) {
            spot.SpotImage = preview.url;
        }
        else {
            spot.SpotImage = 'No Images';
        }
    }
    return res.status(200).json({
        Spots: listOfSpotsJSON
    })
    
})

module.exports = router;