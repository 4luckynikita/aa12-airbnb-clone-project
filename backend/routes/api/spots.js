const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

//spot validator
const validateSpot = [
    check('address')
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .isDecimal({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .isDecimal({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .isDecimal({ min: 0 })
        .withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

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
        if(reviews > 0){
            spot.avgRating = (totalStars / reviews);
        }
        else{
            spot.avgRating = 'No Ratings';
        }

        let preview = await SpotImage.findOne({
            where: {
                spotId : spot.id,
                preview : true
            }
        })

        if(preview) {
            spot.previewImage = preview.url;
        }
        else {
            spot.previewImage = 'No Images';
        }
    }
    return res.status(200).json({
        Spots: listOfSpotsJSON
    })
    
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const currentUser = req.user;
    
    const spots = await Spot.findAll({
        where: {
            ownerId: currentUser.id
        }
    });

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
        if(reviews > 0){
            spot.avgRating = (totalStars / reviews);
        }
        else{
            spot.avgRating = 'No Ratings';
        }

        let preview = await SpotImage.findOne({
            where: {
                spotId : spot.id,
                preview : true
            }
        })

        if(preview) {
            spot.previewImage = preview.url;
        }
        else {
            spot.previewImage = 'No Images';
        }
    };
    return res.status(200).json({
        Spots: listOfSpotsJSON
    });
});

//Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId,{ raw: true });
    if(!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }
    const reviews = await Review.count({
        where: {
            spotId: spotId
        }
    });
    const totalStars = await Review.sum('stars', {
        where: {
            spotId: spotId
        }
    });
    console.log(reviews, totalStars);
    if(reviews > 0){
        spot.numReviews = reviews;
        spot.avgStarRating = (totalStars / reviews);
    }
    else{
        spot.numReviews = 0;
        spot.avgRating = 'No Ratings';
    }

    spot.SpotImages = [];
    const spotImagery = await SpotImage.findAll({
        where: {
            spotId: spot.id
        }
    });
    spotImagery.forEach(async (image) => {
        spot.SpotImages.push({
            id: image.id,
            url: image.url,
            preview: image.preview
        });
    });

    const owner = await User.findByPk(spot.ownerId);
    spot.Owner = {
        id: owner.id,
        firstName: owner.firstName,
        lastName: owner.lastName
    };

    return res.status(200).json(spot);
});

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;
    const newSpot = await Spot.create({
        ownerId: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    return res.status(201).json(newSpot);
});

//Add an Image to a Spot based on the Spot's id

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    let user = req.user;

    //existing spot and proper authorization check
    const currentSpot = await Spot.findByPk(spotId);
    if (!currentSpot) return res.status(404).json({message: 'Incorrect Spot Id Specified.'});
    if(currentSpot.ownerId !== user.id) return res.status(403).json({message: 'This is not your spot!'});

    const { url, preview } = req.body;
    const spotImage = await SpotImage.create({
        spotId,
        url,
        preview
    });

    return res.status(200).json({
        id: spotImage.id,
        url: spotImage.url,
        preview: spotImage.preview
    })
});

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res) =>{
    const spotId = req.params.spotId;
    const user = req.user;
    //existing spot and proper authorization check
    const spotToEdit = await Spot.findByPk(spotId);
    if (!spotToEdit) return res.status(404).json({message: 'Incorrect Spot Id Specified.'});
    if(spotToEdit.ownerId !== user.id) return res.status(403).json({message: 'This is not your spot!'});

    await spotToEdit.update(req.body);
    //for response find again
    const spotEdited = await Spot.findByPk(spotId);
    return res.status(200).json(spotEdited);
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const user = req.user;
    const spotId = req.params.spotId;
    //existing spot and proper authorization check
    const spotToDelete = await Spot.findByPk(spotId);
    if (!spotToDelete) return res.status(404).json({message: 'Incorrect Spot Id Specified.'});
    if(spotToDelete.ownerId !== user.id) return res.status(403).json({message: 'This is not your spot!'});

    await spotToDelete.destroy();
    return res.status(200).json({"message": "Successfully deleted"});
});

module.exports = router;