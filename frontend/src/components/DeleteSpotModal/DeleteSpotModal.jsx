import './DeleteSpotModal.css'
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { getCurrentUserSpotsThunk } from '../../store/spots';


const DeleteSpotModal = ({ spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();





    const handleDelete = async (e) => {
        e.preventDefault()

        await dispatch(deleteSpotThunk(spotId));
        closeModal();
        //window.location.reload();
        await dispatch(getCurrentUserSpotsThunk(spotId));
    }

    return (
        <div className="delete-modal-container">
            <form onSubmit={handleDelete} >
                <h1>Confirm Delete</h1>
                <div>
                    <p>Are you sure you want to remove this spot from the listings?</p>
                </div>
                <button type="submit" className="delete-spot-button">Yes (Delete Spot)</button>
                <button onClick={() => closeModal()} className="keep-spot-button">No (Keep Spot)</button>
            </form>
        </div>
    );
};

export default DeleteSpotModal;