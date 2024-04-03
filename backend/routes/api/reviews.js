const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const user = req.user;
    const userReviews = await Review.findAll({
        where: { userId: user.id },
        raw: true
    });
    //Iterate through userReviews array to add User, Spot, and ReviewImages properties to each review
    for (let i = 0; i < userReviews.length; i++) {
        //Add User Key to Reviews[i]
        const userInfo = await User.findOne({
            where: {
                id : user.id
            },
            raw: true
        });
        userReviews[i].User = {
            id: userInfo.id,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName
        };

        //Add Spot Key to Reviews[i]
        const userSpots = await Spot.findOne({
            where: {
                id: userReviews[i].spotId
            },
            raw: true
        });
        let spotImages = await SpotImage.findOne({
            where: {
                spotId: userSpots.id
            }
        });
        if (spotImages) {
            userSpots.previewImage = spotImages.url;
        }
        else {
            userSpots.previewImage = 'No Image Found';
        };
        userReviews[i].Spot = {
            id: userSpots.id,
            ownerId: userSpots.ownerId,
            address: userSpots.address,
            city: userSpots.city,
            state: userSpots.state,
            country: userSpots.country,
            lat: userSpots.lat,
            lng: userSpots.lng,
            name: userSpots.name,
            price: userSpots.price,
            previewImage: userSpots.previewImage
        };
        //Add ReviewImages key to Reviews[i]
        const spotReviewImages = await ReviewImage.findAll({
            where: {
                reviewId: userReviews[i].id
            },
            raw: true
        });
        userReviews[i].ReviewImages = [];
        for (let image of spotReviewImages){
            userReviews[i].ReviewImages.push({
                id: image.id,
                url: image.url
            });
        };
    };
    
    return res.status(200).json({
        Reviews: userReviews
    });
});

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res) => {
    const reviewId = req.params.reviewId;
    const user = req.user;
    const url = req.body.url;
    const review = await Review.findByPk(reviewId);
    const numOfImages = await ReviewImage.count({ 
        where: { 
            reviewId: reviewId 
        } 
    });
    //Authorizations and validations first
    if(review.userId !== user.id) return res.status(403).json({message: 'Forbidden'});
    if(!review) return res.status(404).json({ message: "Review couldn't be found" });
    if(numOfImages>=10) return res.status(403).json({ message: "Maximum number of images for this review was reached"});

    const newImage = await ReviewImage.create({
        url: url,
        reviewId: reviewId
    });
    return res.status(200).json({id: newImage.id, url: newImage.url});
});

//Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const user = req.user;
    const { review, stars } = req.body;
    const existingReview = await Review.findByPk(reviewId);

    //Authorizations, Errors, and validations first
    console.log(existingReview);
    if(!existingReview) return res.status(404).json({ message: "Review couldn't be found" });
    if(existingReview.userId !== user.id) return res.status(403).json({message: 'Forbidden'});
    
    let errorBody = {
        message: "Bad Request",
        errors : {}
    }
    if(!review || review.length===0) errorBody.errors.review = "Review text is required";
    if(!stars || !(stars >= 1 && stars <= 5)) errorBody.errors.stars = "Stars must be an integer from 1 to 5";
    if(errorBody.errors.review || errorBody.errors.stars) return res.status(400).json(errorBody);

    const updatedReview = await existingReview.update(req.body);
    return res.status(200).json(updatedReview);
});

//Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res) => {
    const reviewId = req.params.reviewId;
    const user = req.user;
    const existingReview = await Review.findByPk(reviewId);

    //Authorizations, Errors, and validations first
    console.log(existingReview);
    if(!existingReview) return res.status(404).json({ message: "Review couldn't be found" });
    if(existingReview.userId !== user.id) return res.status(403).json({message: 'Forbidden'});

    await existingReview.destroy();

    return res.status(200).json({message: "Successfully deleted"});
});

module.exports = router;