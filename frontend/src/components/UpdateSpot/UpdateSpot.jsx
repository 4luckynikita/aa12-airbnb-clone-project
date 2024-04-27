import './UpdateSpot.css'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
//import * as sessionActions from '../../store/session'; // ????
import { getSpotDetails, updateSpotThunk } from '../../store/spots';

const UpdateSpot = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = useSelector(state => state.session.user)
    const {spotId} = useParams();
    console.log(spotId);

    let spotState = useSelector(state => state.spots)
    // console.log('spots',spots);
    spotState = Object.values(spotState)
    const currentSpot = spotState.find(spot => spot.id === +spotId)

    useEffect(() => {
        dispatch(getSpotDetails(spotId));
    }, [dispatch, spotId]);
    console.log(currentSpot)

    //define all states
    const [address, setAddress] = useState(currentSpot?.address)
    const [city, setCity] = useState(currentSpot?.city)
    const [state, setState] = useState(currentSpot?.state)
    const [country, setCountry] = useState(currentSpot?.country)
    // const [lat, setLat] = useState(0)
    // const [lng, setLng] = useState(0)
    const [name, setName] = useState(currentSpot?.name)
    const [description, setDescription] = useState(currentSpot?.description)
    const [price, setPrice] = useState(currentSpot?.price)
    // const [mainImage, setMainImage] = useState('')
    // const [spotImageOne, setSpotImageOne] = useState('')
    // const [spotImageTwo, setSpotImageTwo] = useState('')
    // const [spotImageThree, setSpotImageThree] = useState('')
    // const [spotImageFour, setSpotImageFour] = useState('')
    const [errors, setErrors] = useState({})

    //prefill values
    // setAddress(currentSpot?.address)
    // setCity(currentSpot?.city);
    // setState(currentSpot?.state);
    // setCountry(currentSpot?.country);
    // if(currentSpot?.lat) setLat(currentSpot?.lat);
    // if(currentSpot?.lng) setLng(currentSpot?.lng);
    // setName(currentSpot?.name);
    // setDescription(currentSpot?.description);
    // setPrice(currentSpot?.price);
    // if(currentSpot?.previewImage) {
    //     setMainImage(currentSpot?.previewImage);
    // }
    // else if(currentSpot?.SpotImages){
    //     setMainImage(currentSpot?.SpotImages[0].url);
    // }

    //set up useEffect for monitoring validations
    useEffect(() => {
        //FIX when latitude and longitude not provided dont force?
        // setLat(89)
        // setLng(179)
        
        const errorsObj = {}
        if (!currentUser) {
            navigate('/')
        }
        console.log(currentUser)
        
           
        
        if (!address) errorsObj.address = 'Address is required'
        if (!city) errorsObj.city = 'City is required'
        if (!state) errorsObj.state = 'State is required'
        if (!country) errorsObj.country = 'Country is required'
        if (!name) errorsObj.name = 'Name is required'
        if (!description || description.length < 30) errorsObj.description = 'Description needs a minimum of 30 characters'
        if (!price) errorsObj.price = 'Price is required'
        

        setErrors(errorsObj)

    }, [address, city, state, country, name, description, price, currentUser, navigate])
    const handleSubmit = async (e) => {
        e.preventDefault()

        const updatedSpot = {
            ownerId: currentUser.id,
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat: 89,
            lng: 179
        }
      
        const createdSpot = await dispatch(updateSpotThunk(updatedSpot, spotId))
        dispatch(getSpotDetails(updatedSpot))
        navigate(`/spots/${createdSpot.id}`)
    }


    return (
        <div className='outermost-container' key={'createSpot'}>
            <div className="create-spot-container">
                <h1>Update your Spot</h1>
                <h2>{`Where's your place located?`}</h2>
                <p className="address-info">Guests will only get your exact address once they booked a reservation.</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            <div className="error-container">
                                <p>Country</p> {errors.country && <p className="error-msg">{errors.country}</p>}
                            </div>
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="regular-input"
                                placeholder="Country"
                            />
                        </label>
                        <label>
                            <div className="error-container">
                                <p>Street Address</p>
                                {errors.address && <p className="error-msg">{errors.address}</p>}
                            </div>

                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="regular-input"
                                placeholder="Address"
                            />
                        </label>
                    </div>
                    <div className="city-state-container">
                        <label className='city-label'>
                            <div className="error-container">
                                <p>City</p>
                                {errors.city && <p className="error-msg">{errors.city}</p>}
                            </div>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                className="city-state-input"
                            />
                        </label>
                        <label className='state-label'>
                            <div className="error-container">
                                <p>State</p>
                                {errors.state && <p className="error-msg">{errors.state}</p>}
                            </div>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="STATE"
                                className="city-state-input"
                            />
                        </label>
                    </div>
                    {/* <div className="lat-lng-container">
                        <label className='lat-lng-label theleftone'>
                            <p>Latitude</p>
                            <input
                                type="text"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                className="lat-input"
                                placeholder="Latitude"
                            />
                        </label>
                        <label className='lat-lng-label therightone'>
                            <p>Longitude</p>
                            <input
                                type="text"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                className="lng-input"
                                placeholder="Longitude"
                            />
                        </label>
                    </div> */}
                    <div className="spot-description-container">
                        <h1>Describe your place to guests</h1>
                        <p>Mention the best features of your space, any special amentities like fast wifi, or parking, and what you love about the neighborhood.</p>
                        <textarea
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                        />
                        {errors.description && <p className="error-msg">{errors.description}</p>}
                    </div>
                    <div className="spot-title-container">
                        <h1>Create a title for your spot</h1>
                        <p>{"Catch guests' attention with a spot title that highlights what makes your place special."}</p>
                        <label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name of your spot"
                            />
                        </label>
                        {errors.name && <p className="error-msg">{errors.name}</p>}
                    </div>
                    <div className="spot-price-container">
                        <h1>Set a base price for our spot</h1>
                        <p> Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <label>
                            <div className='price-input-container'>
                                <p>$</p>
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Price per night(USD)"
                                />
                            </div>
                        </label>
                        {errors.price && <p className="error-msg">{errors.price}</p>}
                    </div>
                    {/* <div className="spot-images-container">
                        <h1>Liven up your spot with photos</h1>
                        <p> Submit a link to at least one photo to publish your spot.</p>
                        <label>
                            <input
                                type="text"
                                value={mainImage}
                                onChange={(e) => setMainImage(e.target.value)}
                                placeholder="Preview Image URL"
                            />
                        </label>
                        {errors.mainImage && <p className="error-msg">{errors.mainImage}</p>}
                        <div className="image-input-boxes">
                            <label>
                                <input
                                    type="text"
                                    value={spotImageOne}
                                    onChange={(e) => setSpotImageOne(e.target.value)}
                                    placeholder="Image URL"
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    value={spotImageTwo}
                                    onChange={(e) => setSpotImageTwo(e.target.value)}
                                    placeholder="Image URL"
                                />
                            </label>
                            <label>

                                <input
                                    type="text"
                                    value={spotImageThree}
                                    onChange={(e) => setSpotImageThree(e.target.value)}
                                    placeholder="Image URL"
                                />
                            </label>
                            <label>
                                <input
                                    type="text"
                                    value={spotImageFour}
                                    onChange={(e) => setSpotImageFour(e.target.value)}
                                    placeholder="Image URL"
                                />
                            </label>
                        </div>
                    </div> */}
                    <div className="submit-button-container">
                        <button className="submit-button"
                            type="submit"
                            disabled={Object.values(errors).length > 0}
                        >Update Spot</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateSpot;