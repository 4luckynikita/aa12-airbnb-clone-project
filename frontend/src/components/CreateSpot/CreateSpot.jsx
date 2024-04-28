import './CreateSpot.css'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//import * as sessionActions from '../../store/session'; // ????
import { getSpotDetails, createASpotThunk } from '../../store/spots';

const CreateSpot = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = useSelector(state => state.session.user)

    //define all states
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [lat, setLat] = useState(89)
    const [lng, setLng] = useState(179)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [mainImage, setMainImage] = useState('')
    const [spotImageOne, setSpotImageOne] = useState('')
    const [spotImageTwo, setSpotImageTwo] = useState('')
    const [spotImageThree, setSpotImageThree] = useState('')
    const [spotImageFour, setSpotImageFour] = useState('')
    const [errors, setErrors] = useState({})

    //set up useEffect for monitoring validations
    useEffect(() => {

        //FIX when latitude and longitude not provided dont force?
        setLat(89)
        setLng(179)
        const errorsObj = {}
        if (!currentUser) {
            navigate('/')
        }
        if (!address) errorsObj.address = 'Address is required'
        if (!city) errorsObj.city = 'City is required'
        if (!state) errorsObj.state = 'State is required'
        if (!country) errorsObj.country = 'Country is required'
        if (!name) errorsObj.name = 'Name is required'
        if (!description || description.length < 30) errorsObj.description = 'Description needs a minimum of 30 characters'
        if (!price) errorsObj.price = 'Price is required'
        if (price && (!isNaN(price) === false || price.length < 1)) errorsObj.price = 'Price must be an integer'
        if (!mainImage) errorsObj.mainImage = 'Preview image is required'
        //hello
        if(mainImage.length && !(mainImage.endsWith('.png') || mainImage.endsWith('.jpg') || mainImage.endsWith('.jpeg'))) errorsObj.mainImage = 'Image URL needs to end in png or jpg (or jpeg)';
        if(spotImageOne.length && !(spotImageOne.endsWith('.png') || spotImageOne.endsWith('.jpg') || spotImageOne.endsWith('.jpeg'))) errorsObj.spotImageOne = 'Image URL needs to end in png or jpg (or jpeg)';
        if(spotImageTwo.length && !(spotImageTwo.endsWith('.png') || spotImageTwo.endsWith('.jpg') || spotImageTwo.endsWith('.jpeg'))) errorsObj.spotImageTwo = 'Image URL needs to end in png or jpg (or jpeg)';
        if(spotImageThree.length && !(spotImageThree.endsWith('.png') || spotImageThree.endsWith('.jpg') || spotImageThree.endsWith('.jpeg'))) errorsObj.spotImageThree = 'Image URL needs to end in png or jpg (or jpeg)';
        if(spotImageFour.length && !(spotImageFour.endsWith('.png') || spotImageFour.endsWith('.jpg') || spotImageFour.endsWith('.jpeg'))) errorsObj.spotImageFour = 'Image URL needs to end in png or jpg (or jpeg)';


        setErrors(errorsObj)

    }, [address, city, state, country, name, description, price, mainImage, currentUser, spotImageOne, spotImageTwo, spotImageThree, spotImageFour, navigate])
    const handleSubmit = async (e) => {
        e.preventDefault()

        const newSpot = {
            ownerId: currentUser.id,
            address,
            city,
            state,
            country,
            name,
            description,
            price,
            lat,
            lng
        }
        const newImages = {
            mainImage,
            spotImageOne,
            spotImageTwo,
            spotImageThree,
            spotImageFour
        }
        const createdSpot = await dispatch(createASpotThunk(newSpot, newImages))
        dispatch(getSpotDetails(createdSpot));
        navigate(`/spots/${createdSpot.id}`);
        window.location.reload();
    }


    return (
        <div className='outermost-container' key={'createSpot'}>
            <div className="create-spot-container">
                <h1>Create a new Spot</h1>
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
                    <div className="spot-images-container">
                        <h1>Liven up your spot with photos</h1>
                        <p> Submit a link to at least one photo to publish your spot.</p>
                        <label>
                            <input
                                type="text"
                                value={mainImage}
                                onChange={(e) => setMainImage(e.target.value)}
                                placeholder="Preview Image URL"
                            />
                            {errors.mainImage && <p className="error-msg">{errors.mainImage}</p>}
                        </label>
                        
                        <div className="image-input-boxes">
                            <label>
                                <input
                                    type="text"
                                    value={spotImageOne}
                                    onChange={(e) => setSpotImageOne(e.target.value)}
                                    placeholder="Image URL"
                                />
                                {errors.spotImageOne && <p className="error-msg">{errors.spotImageOne}</p>}
                            </label>
                            <label>
                                <input
                                    type="text"
                                    value={spotImageTwo}
                                    onChange={(e) => setSpotImageTwo(e.target.value)}
                                    placeholder="Image URL"
                                />
                            </label>
                            {errors.spotImageTwo && <p className="error-msg">{errors.spotImageTwo}</p>}
                            <label>

                                <input
                                    type="text"
                                    value={spotImageThree}
                                    onChange={(e) => setSpotImageThree(e.target.value)}
                                    placeholder="Image URL"
                                />
                                {errors.spotImageThree && <p className="error-msg">{errors.spotImageThree}</p>}
                            </label>
                            <label>
                                <input
                                    type="text"
                                    value={spotImageFour}
                                    onChange={(e) => setSpotImageFour(e.target.value)}
                                    placeholder="Image URL"
                                />
                                {errors.spotImageFour && <p className="error-msg">{errors.spotImageFour}</p>}
                            </label>

                        </div>
                    </div>
                    <div className="submit-button-container">
                        <button className="submit-button"
                            type="submit"
                            disabled={Object.values(errors).length > 0}
                        >Create a Spot</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateSpot;