import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarModalComponent from "./StarModalComponent";
import { createReviewThunk } from "../../store/reviews";
import { getSpotDetails } from "../../store/spots";
import './CreateReviewModal.css';



const CreateAReview = () => {

    const { closeModal } = useModal()
    const dispatch = useDispatch()
    const { spotId } = useParams()
    let allReviews = useSelector(state => state.reviews)
    allReviews = Object.values(allReviews)
    const currentUser = useSelector(state => state.session.user?.id)
    console.log(currentUser);
    const spotOwner = useSelector(state => state.spots?.[spotId].ownerId)
    const reviewed = allReviews?.find(review => review.userId === currentUser)


    const [stars, setStars] = useState(0)
    const [review, setReview] = useState('')
    const [errors, setErrors] = useState({})

    useEffect(() => {
        const errorsObj = {}
        if (review.length < 10) errorsObj.review = "Review must be at least 10 characters"
        if (!stars) errorsObj.stars = "Please rate your stay 1-5"
        setErrors(errorsObj)

    }, [review, stars])



    const submitHandler = async (e) => {
        e.preventDefault()

        const newReview = {
            review,
            stars
        }

        await dispatch(createReviewThunk(newReview, spotId))
        await dispatch(getSpotDetails(spotId))
        closeModal();
        setReview('')
        setStars(null)
        setErrors({})
        window.location.reload();
    }

    if (!(currentUser && (currentUser !== spotOwner) && !reviewed)) closeModal();
    return (
        <div className="review-modal-container">
            {currentUser && (currentUser !== spotOwner) && !reviewed && (
                <form onSubmit={submitHandler}>
                    <h1>How was your stay?</h1>
                    {errors.review && <p className="errors-mess">{errors.review}</p>}
                    <textarea
                        type="text"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Type your review here" />
                    

                    {errors.stars && <p className="errors-mess">{errors.stars}</p>}
                    <StarModalComponent setStars={setStars} stars={stars} />

                    <button
                        type="submit"
                        className="delete-review-button"
                        disabled={Object.values(errors).length > 0}>
                        Submit Your Review
                    </button>

                </form>
            )}
        </div>
    )
}




export default CreateAReview;