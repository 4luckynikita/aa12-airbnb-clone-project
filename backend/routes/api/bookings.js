const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async(req,res) => {
    const user = req.user;
    const allBookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        raw: true
    });

    //add Spot key with proper info to all Bookings in array via iteration (its a POJO)
    for(let i=0; i<allBookings.length; i++){
        const bookingSpot = await Spot.findByPk(allBookings[i].spotId);
        const previewImages = await SpotImage.findAll({
            where: {
                spotId: allBookings[i].spotId
            }
        });
        const spotObj = {
            id: bookingSpot.id,
            ownerId: bookingSpot.ownerId,
            address: bookingSpot.address,
            city: bookingSpot.city,
            state: bookingSpot.state,
            country: bookingSpot.country,
            lat: bookingSpot.lat,
            lng: bookingSpot.lng,
            name: bookingSpot.name,
            price: bookingSpot.price,
            previewImage: 'No Images'
        };
        if(previewImages.length >= 1) spotObj.previewImage = previewImages[0].url;

        allBookings[i].Spot = spotObj;
    }
    

    return res.status(200).json({
        Bookings: allBookings
    });
});

//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId;
    const user = req.user;
    const { startDate, endDate } = req.body;

    //Validations
    const startDateJS = new Date(startDate);
    const endDateJS = new Date(endDate);
    const currentBooking = await Booking.findByPk(bookingId);
    if(!currentBooking) return res.status(404).json({message: "Booking couldn't be found"});
    if(user.id !== currentBooking.userId) return res.status(403).json({message: "You must change your own booking"});
    if(new Date(currentBooking.endDate) < new Date()) return res.status(400).json({message: "Past bookings can't be modified"});
    //^ i tested this, confirmed OK
    let errorBody = {
        message: "Bad Request",
        errors : {}
    }
    if(startDateJS < new Date()) errorBody.errors.startDate = "startDate cannot be in the past";
    if(startDateJS >= endDateJS) errorBody.errors.endDate = "endDate cannot be on or before startDate";
    if(errorBody.errors.startDate || errorBody.errors.endDate) return res.status(400).json(errorBody);
    //Existing booking validators
    const existingBookings = await Booking.findAll({
        where: {
            spotId: currentBooking.spotId
        }
    });
    //remove current booking from existingBookings array
    for(let i = 0; i < existingBookings.length; i++){
        if(existingBookings[i].id === currentBooking.id) existingBookings.splice(i, 1);
    };

    let bookingErrorBody = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
    };

    for(let booking of existingBookings){
        const bookingStartDate = new Date(booking.startDate);
        const bookingEndDate = new Date(booking.endDate);
        if(startDateJS >= bookingStartDate && startDateJS <= bookingEndDate) bookingErrorBody.errors.startDate = "Start date conflicts with an existing booking";
        if(endDateJS >= bookingStartDate && endDateJS <= bookingEndDate) bookingErrorBody.errors.endDate = "End date conflicts with an existing booking";
        if(startDateJS <= bookingStartDate && endDateJS >= bookingEndDate) {
            bookingErrorBody.errors.startDate = "Start date conflicts with an existing booking";
            bookingErrorBody.errors.endDate = "End date conflicts with an existing booking";
        }
    }
    if(Object.keys(bookingErrorBody.errors).length > 0) return res.status(403).json(bookingErrorBody);

    //if we're here, all is well with the request
    const updatedSpot = await currentBooking.update({
        spotId: currentBooking.spotId,
        userId: currentBooking.userId,
        startDate: startDateJS,
        endDate: endDateJS
    });

    return res.status(200).json(updatedSpot);
});

//Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const user = req.user;
    const bookingId = req.params.bookingId;
    const oldBooking = await Booking.findByPk(bookingId);

    //validations
    if(!oldBooking) return res.status(404).json({message: "Booking couldn't be found"});
    if(oldBooking.userId !== user.id) return res.status(403).json({message: "You can only delete your own bookings"});
    const startDateJS = new Date(oldBooking.startDate);
    if(startDateJS <= new Date()) return res.status(403).json({message: "Bookings that have been started can't be deleted"});
    //^^tested working

    await oldBooking.destroy();

    return res.status(200).json({messages: "Successfully deleted"});
});

module.exports = router;