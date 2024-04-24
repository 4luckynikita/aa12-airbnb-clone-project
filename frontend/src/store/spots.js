import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "posts/GET_ALL_SPOTS";
const GET_SPOT = "spots/GET_SPOT";

const getSpots = (spots) => 
    ({
        type: GET_ALL_SPOTS,
        spots
  }  )

  const getSpot = (spot) => ({
    type: GET_SPOT,
    spot
  })


  //get all spots
export const spotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');
    const final = await res.json();

    dispatch(getSpots(final));

    return res;
}

//get spot by id
export const getSpotDetails = (spotId) => async (dispatch) =>{
    const response = await csrfFetch(`/api/spots/${spotId}`)

    const data = await response.json()

    dispatch(getSpot(data))
    return response
}


function spotsReducer(state = {}, action){
    switch(action.type){
        case GET_ALL_SPOTS: {
            const newState = {};
            action.spots.Spots.forEach((spot) => {
                newState[spot.id] = spot;
            })
            return newState;
        }
        case GET_SPOT: {
            const newState = {...state, [action.spot.id]: action.spot}
            return newState
        }
        default: return state;
    }

}

export default spotsReducer;