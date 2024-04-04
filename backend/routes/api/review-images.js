const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

//Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId;
    const user = req.user;
    const oldImage = await ReviewImage.findByPk(imageId);

    //validations
    if(!oldImage) return res.status(404).json({message: "Review Image couldn't be found"});
    const oldReview = await Review.findByPk(oldImage.reviewId);
    if(oldReview.userId !== user.id) return res.status(403).json({message: "You can only delete your own review images!"});

    await oldImage.destroy();

    return res.status(200).json({message: "Successfully deleted"});
});

module.exports = router;