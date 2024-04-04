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

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const spotId = req.params.spotId;
    const allReviews = await Review.findAll({
        where: {
            spotId: spotId
        },
        raw: true
    });
    //Check if spot exists, exit router if not
    if(allReviews.length < 1) return res.status(404).json({message: "Spot couldn't be found"});

    //iterate through allReviews array to add User and ReviewImages keys
    for(let i = 0; i < allReviews.length; i++){
        //add User key to specific review
        const reviewUser = await User.findOne({
            where: {
                id: allReviews[i].userId
            },
            raw: true
        });
        allReviews[i].User = {
            id: reviewUser.id,
            firstName: reviewUser.firstName,
            lastName: reviewUser.lastName
        };
        //add ReviewImages key to specific review
        const imagesFromReview = await ReviewImage.findAll({
            where: {
                reviewId: allReviews[i].id
            }
        });
        allReviews[i].ReviewImages = [];
        for(let image of imagesFromReview){
            allReviews[i].ReviewImages.push({
                id: image.id,
                url: image.url
            })
        }
    };
    
    return res.status(200).json({Reviews: allReviews});
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const user = req.user;
    const { review, stars } = req.body;
    const currentSpot = await Spot.findOne({
        where: {
            id: spotId
        }
    });

    //check if specified spot exists
    if(!currentSpot) return res.status(404).json({message: "Spot couldn't be found"});

    //check if review already exists
    const existingReview = await Review.findOne({
        where: {
            userId: user.id,
            spotId: spotId
        }
    });
    if(existingReview) return res.status(500).json({message: "User already has a review for this spot"});

    //check review parameters
    let errorBody = {
        message: "Bad Request",
        errors : {}
    }
    if(!review || review.length===0) errorBody.errors.review = "Review text is required";
    if(!stars || !(stars >= 1 && stars <= 5)) errorBody.errors.stars = "Stars must be an integer from 1 to 5";
    if(errorBody.errors.review || errorBody.errors.stars) return res.status(400).json(errorBody);

    const createdReview = await Review.create({
        userId: user.id,
        spotId: spotId,
        review: review,
        stars: stars
    });

    return res.status(201).json(createdReview);
});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const user = req.user;
    const spotBookings = await Booking.findAll({
        where: {
            spotId : spotId
        },
        raw: true
    });

    //validator
    const spotForCheck = await Spot.findByPk(spotId);
    if(!spotForCheck) return res.status(404).json({message: "Spot couldn't be found"});

    //if the booking is for owner of spot
    if(user.id === spotForCheck.ownerId){
        //add User key to each booking object
    for(let i = 0; i < spotBookings.length; i++){
        const bookingUser = await User.findByPk(spotBookings[i].userId);
        spotBookings[i].User = {
            id: bookingUser.id,
            firstName: bookingUser.firstName,
            lastName: bookingUser.lastName
        }
    }

    return res.status(200).json({
        Bookings: spotBookings
    });
    }
    else{
        const trimmedFinal = [];
        for(let i = 0; i < spotBookings.length; i++){
            trimmedFinal.push({
                spotId: spotBookings[i].spotId,
                startDate: spotBookings[i].startDate,
                endDate: spotBookings[i].endDate
            });
        }

        return res.status(200).json({
            Bookings: trimmedFinal
        });
    }
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const user = req.user;

    //request validators
    const currentSpot = await Spot.findByPk(spotId);
    const { startDate, endDate } = req.body;
    const startDateJS = new Date(startDate);
    const endDateJS = new Date(endDate);
    if(!currentSpot) return res.status(404).json({message: "Spot couldn't be found"});
    if(user.id === currentSpot.ownerId) return res.status(400).json({message: "You cannot book your own spot!"});
    let errorBody = {
        message: "Bad Request",
        errors : {}
    }
    if(startDateJS < new Date()) errorBody.errors.startDate = "startDate cannot be in the past";
    if(startDateJS >= endDateJS) errorBody.errors.endDate = "endDate cannot be on or before startDate";
    if(errorBody.errors.startDate || errorBody.errors.endDate) return res.status(400).json(errorBody);

    //Existing booking validators
    const existingBookingStart = await Booking.findAll({
        where: {
            spotId: spotId,
            startDate: startDateJS
        }
    });
    const existingBookingEnd = await Booking.findAll({
        where: {
            spotId: spotId,
            endDate: endDateJS
        }
    });
    let bookingErrorBody = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors : {}
    }
    if(existingBookingStart.length > 0) bookingErrorBody.errors.startDate = "Start date conflicts with an existing booking";
    if(existingBookingEnd.length > 0) bookingErrorBody.errors.endDate = "End date conflicts with an existing booking";
    if(bookingErrorBody.errors.startDate || bookingErrorBody.errors.endDate) return res.status(403).json(bookingErrorBody);
   
    //if we're here, we have no errors to throw
    const newBooking = await Booking.create({
        spotId: Number(spotId),
        userId : user.id,
        startDate: startDate,
        endDate : endDate
    });

    return res.status(400).json(newBooking);
});

module.exports = router;