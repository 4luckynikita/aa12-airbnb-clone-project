import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "posts/GET_ALL_SPOTS";
const GET_SPOT = "spots/GET_SPOT";
const CREATE_SPOT = "spots/CREATE_SPOT";
const GET_SPOT_BY_USER = 'spots/GET_SPOT_BY_USER';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';

const getSpots = (spots) =>
({
    type: GET_ALL_SPOTS,
    spots
})

const getSpot = (spot) => ({
    type: GET_SPOT,
    spot
});

const createASpot = (spots) => ({
    type: CREATE_SPOT,
    spots
});

const getCurrentUserSpots = (spots) => ({
    type: GET_SPOT_BY_USER,
    spots
});

const updateSpot = (spots) => ({
    type: UPDATE_SPOT,
    spots
});
const deleteSpot = (spots) => ({
    type: DELETE_SPOT,
    spots
});


//get all spots
export const spotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');
    const final = await res.json();

    dispatch(getSpots(final));

    return res;
}

//get spot by id
export const getSpotDetails = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    const data = await response.json()

    await dispatch(getSpot(data))
    return response
}

//create a spot
export const createASpotThunk = (spot, images) => async dispatch => {

    const imageLinks = Object.values(images)

    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    })

    const newSpot = await res.json()
    const spotImagesAdded = imageLinks.forEach(url => {

        csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url, preview: true })
        })
    })

    await dispatch(createASpot(newSpot, spotImagesAdded))
    return newSpot
}

export const getCurrentUserSpotsThunk = () => async dispatch => {
    const res = await csrfFetch('/api/spots/current')
    const dataJSON = await res.json()

    await dispatch(getCurrentUserSpots(dataJSON))
    return res
}

export const updateSpotThunk = (spot, spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spot)
    })

    const dataJSON = await res.json()

    await dispatch(updateSpot(dataJSON))
    return dataJSON;
}

export const deleteSpotThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
        }
    );
    await dispatch(deleteSpot(spotId));
    return res.json('Spot deleted!');
}


function spotsReducer(state = {}, action) {
    switch (action.type) {
        case GET_ALL_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot;
            })
            return newState;
        }
        case GET_SPOT: {
            const newState = { ...state, [action.spot.id]: action.spot };
            return newState;
        }
        case CREATE_SPOT: {
            const newState = { ...state };
            newState[action.spots.id] = action.spots;
            return newState;
        }
        case GET_SPOT_BY_USER: {
            const newState = {};
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot;
            });
            return newState;
        }
        case UPDATE_SPOT: {
            const newState = { ...state };
            newState[action.spots.id] = action.spots;
            return newState;
        }
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        default: return state;
    }

}

export default spotsReducer;