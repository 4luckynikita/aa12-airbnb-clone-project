import '../HomePage/HomePage.css';
import './ManageSpots.css';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { BsStarFill } from "react-icons/bs";
import { NavLink } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import { getCurrentUserSpotsThunk } from '../../store/spots';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal'

const HomePage = () => {
    const dispatch = useDispatch();

    let spotState = useSelector(state => state.spots);

    useEffect(() => {
        dispatch(getCurrentUserSpotsThunk());
    }, [dispatch]);

    return (
        <div className='component-container'>
            <h1 className='title-h1'>Manage Spots</h1>
            <NavLink className='new-spot-button' to={`/spots/new`}>
                <button>Create a New Spot</button>
            </NavLink>
        <div className='spot-section'>
            
            {Object.values(spotState).map((spot) => (
                <div className='spot-container-home' key={spot.id}>
                    <NavLink to={`/spots/${spot.id}`} className='nav-link'>
                        <img className='spotImg' src={spot.previewImage} alt={`Preview image for ${spot.name}`} />
                        <div className='spot-section-upper'>
                            <p className='spotLocation'>{`${spot.city}, ${spot.state}`}</p>
                            <div className='spot-section-rating'>
                            {spot.avgRating !== 'No Ratings' && <p className='spotReview'><BsStarFill />{spot.avgRating}</p>}
                                {spot.avgRating === 'No Ratings' && <p className='spotReview'><BsStarFill />New</p>}
                            </div>
                        </div>
                        <div className='spot-section-price'>
                            <p className='spotPrice'>{`$${spot.price}`}</p>
                            <p className='spotPrice2'>/night</p>
                        </div>
                    </NavLink>
                    <div className='update-delete-container'>
                        <NavLink to={`/spots/${spot.id}/edit`}>
                            <button>Update</button>
                        </NavLink>
                        
                        <OpenModalButton buttonText={'Delete'} modalComponent={<DeleteSpotModal spotId={+spot.id} />}/>

                    </div>
                </div>
            ))}
        </div>
        </div>
    )
}

export default HomePage;