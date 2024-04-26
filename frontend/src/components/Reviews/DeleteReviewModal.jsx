import { getAllReviewsThunk, deleteReviewThunk } from "../../store/reviews"
import OpenModalButton from "../OpenModalButton/OpenModalButton"
import { useModal } from "../../context/Modal"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import './DeleteReviewModal.css'
import { getSpotDetails } from "../../store/spots"




export const DeleteReviewModal = ({ reviewId, spotId }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    useEffect(() => {
        dispatch(getAllReviewsThunk(spotId))
    }, [spotId, dispatch])

    const deleteUserReview = async (e) => {
        e.preventDefault()
        await dispatch(deleteReviewThunk(reviewId))
        closeModal()
        await dispatch(getSpotDetails(spotId))
        window.location.reload();
    }

    return (

        <OpenModalButton
            buttonText={'Delete This Review'}
            modalComponent={
                <div className="delete-modal-container">
                    <h1>Confirm Delete</h1>
                    <p>Are you sure you want to delete this review?</p>
                        <button className="yes-button" onClick={deleteUserReview}>Yes (Delete Review)</button>
                        <button className="no-button" onClick={() => closeModal()}>No (Keep Review)</button>
                </div>
            }
        />

    )
}