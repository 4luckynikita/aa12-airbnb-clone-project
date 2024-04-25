import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { getSpotDetails } from '../../store/spots';
import { BsStarFill } from "react-icons/bs";
import { getAllReviewsThunk } from '../../store/reviews';

import './SpotDetails.css';

const SpotDetails = () => {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    let spotState = useSelector(state => state.spots)
    spotState = Object.values(spotState)
    const currentSpot = spotState.find(spot => spot.id === +spotId)

    useEffect(() => {
        dispatch(getAllReviewsThunk(spotId));
        dispatch(getSpotDetails(spotId));
        
        
        
    }, [dispatch, spotId]);

    //console.log(currentSpot)
    const handleReserveClick = () => {
        alert("Feature coming soon!")
    };

    const reviews = () => {
        if (!currentSpot) return null;

        const { numReviews, avgStarRating } = currentSpot;

        if (numReviews > 1 && avgStarRating) {
            return `${avgStarRating.toFixed(1)} · ${numReviews} reviews`;
        } else if (numReviews === 1 && avgStarRating) {
            return `${avgStarRating.toFixed(1)} · ${numReviews} review`;
        } else {
            return 'New';
        }
    };
    /****************** */
    let reviewsState = useSelector(state => state.reviews);

    reviewsState = Object.values(reviewsState)

    const reviewsArr = [...reviewsState].reverse()
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    
    // console.log(reviewsState.length)
    // if(reviewsState.length) console.log(reviewsState)
    // if(currentSpot){
        return (
            <>
            {currentSpot && 
            <div className='spot-container' key={spotId}>
                <div className='spot-details'>
                    <div className='spot-details-upper'>
                        <p className='spot-name'>{currentSpot?.name}</p>
                        <p className='spot-location'>{`${currentSpot?.city}, ${currentSpot?.state}, ${currentSpot?.country}`}</p>
                    </div>
                    <div className='spot-image-container'>
                        <img className='spot-image-left' src={currentSpot.SpotImages?.[0]?.url || "https://res.cloudinary.com/dkxfjbynk/image/upload/v1713904091/BNB4Me/Missing-image-232x150_p0evwu.png"} />
                        <div className='spot-image-right-container'>
                            <div className='spot-image-right-container-upper'>
                                <img className='spot-image-right' src={currentSpot.SpotImages?.[1]?.url || "https://res.cloudinary.com/dkxfjbynk/image/upload/v1713904091/BNB4Me/Missing-image-232x150_p0evwu.png"} />
                                <img className='spot-image-right' src={currentSpot.SpotImages?.[2]?.url || "https://res.cloudinary.com/dkxfjbynk/image/upload/v1713904091/BNB4Me/Missing-image-232x150_p0evwu.png"} />
                            </div>
                            <div className='spot-image-right-container-lower'>
                                <img className='spot-image-right' src={currentSpot.SpotImages?.[3]?.url || "https://res.cloudinary.com/dkxfjbynk/image/upload/v1713904091/BNB4Me/Missing-image-232x150_p0evwu.png"} />
                                <img className='spot-image-right' src={currentSpot.SpotImages?.[4]?.url || "https://res.cloudinary.com/dkxfjbynk/image/upload/v1713904091/BNB4Me/Missing-image-232x150_p0evwu.png"} />
                            </div>
                        </div>
                    </div>
                    <div className='spot-details-lower'>
                        <div className='spot-details-lower-left'>
                            <p className='spot-details-host'>{`Hosted by ${currentSpot?.Owner?.firstName} ${currentSpot?.Owner?.lastName}`}</p>
                            <p className='spot-details-description'>{currentSpot?.description}</p>
                        </div>
                        <div className='spot-details-button-container'>
                            <div className='button-container-upper'>
                                <div className='button-container-upper-left'>
                                    <h3 className='button-price'>{`$${currentSpot?.price} `}</h3>
                                    <p className='night-text'>night</p>
                                </div>
                                <div className='button-container-upper-right'>
                                    <p className='review-container-upper'><BsStarFill />{reviews()}</p>
                                </div>
                            </div>
                            <button onClick={handleReserveClick} className='reserve-button'>Reserve</button>
    
                        </div>
                    </div>
                    <div className='spot-reviews-container'>
                    <p className='review-container-lower'><BsStarFill />{reviews()}</p>
                    {reviewsArr.map((review) => (
                        <div className='review-container' key={review?.id}>
                            <p className='review-name'>{review?.User?.firstName}</p>
                            <p className='review-date'>{`${months[new Date(review?.createdAt).getMonth()]} ${new Date(review?.createdAt).getFullYear()}`}</p>
                            <p className='review-body'>{review?.review}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            }
            </>
        )
    // }
}

export default SpotDetails;