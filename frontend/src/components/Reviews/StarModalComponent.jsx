import { useState } from "react";

const StarModalComponent = ({ stars, setStars }) => {
    const [CurrentRating, setCurrentRating] = useState(0)

    const handleRatingClick = (rating) => {
        setCurrentRating(rating);
        setStars(rating);
    };

    const renderStars = () => {
        const starArr = [];
        for (let i = 1; i <= 5; i++) {
            starArr.push(
                <div
                    key={i}
                    onClick={() => handleRatingClick(i)}
                    onMouseEnter={() => setCurrentRating(i)}
                    onMouseLeave={() => setCurrentRating(stars)}
                    >
                    <i className={`fa-${CurrentRating >= i ? "solid" : "regular"} fa-star`}></i>
                </div>
            );
        }
        return starArr;
    };

    return (
        <>
            <div className="stars-container">
                {renderStars()} Stars
            </div>
        </>
    );
};

export default StarModalComponent;