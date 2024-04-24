import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/GET_REVIEWS';

const getReviews = (reviews) => ({
    type: GET_REVIEWS,
    reviews

})

export const getAllReviewsThunk = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    const reviews = await response.json();
    dispatch(getReviews(reviews));
    return reviews;
};

function reviewsReducer(state = {}, action) {
    switch (action.type) {
        case GET_REVIEWS: {
            const newStateObj = {};
            action.reviews.Reviews.forEach((review) => newStateObj[review.id] = review)
            return newStateObj;
        }
        default: return state;
    }
}

export default reviewsReducer