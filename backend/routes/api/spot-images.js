const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

//Delete a Spot Image

router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId;
    const user = req.user;
    const oldImage = await SpotImage.findByPk(imageId);

    //validations
    if(!oldImage) return res.status(404).json({ message: "Spot Image couldn't be found"});
    const oldImageSpot = await Spot.findByPk(oldImage.spotId);
    if(oldImageSpot.ownerId !== user.id) return res.status(403).json({message:"You must be the spot owner to delete an image!"});

    await oldImage.destroy();

    return res.status(200).json({message: "Successfully deleted"});
});

module.exports = router;