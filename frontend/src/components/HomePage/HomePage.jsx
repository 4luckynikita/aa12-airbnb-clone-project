import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import './HomePage.css';
import { spotsThunk } from '../../store/spots';
import { BsStarFill } from "react-icons/bs";
import { NavLink } from 'react-router-dom'
import './HomePage.css'

const HomePage = () => {
    const dispatch = useDispatch();

    let spotState = useSelector(state => state.spots);

    useEffect(() => {
        dispatch(spotsThunk());
    }, [dispatch]);

    return (
        <div className='spot-section'>
            {Object.values(spotState).map((spot) => (
                <div className='spot-container-home' key={spot.id}>
                    <NavLink to={`/spots/${spot.id}`} className='nav-link'>
                        <div className='spotImg-container'>
                            <img className='spotImg' src={spot.previewImage} alt={`Preview image for ${spot.name}`} />
                            <span className='title-tooltip'>{spot.name}</span>
                        </div>
                        <div className='spot-section-upper'>
                            <p className='spotLocation'>{`${spot.city}, ${spot.state}`}</p>
                            <div className='spot-section-rating'>
                                {spot.avgRating !== 'No Ratings' && <p className='spotReview'><BsStarFill />{spot.avgRating}</p>}
                                {spot.avgRating === 'No Ratings' && <p className='spotReview'><BsStarFill />New</p>}
                            </div>
                        </div>
                        <div className='spot-section-price'>
                            <p className='spotPrice'>{`$${spot.price}`}</p>
                            <p> night</p>
                        </div>
                    </NavLink>
                </div>
            ))}
        </div>
    )
}

export default HomePage;