// Jackson — clickable food card for the would-you-rather voting UI
import React from 'react';
import FoodImage from './FoodImage.jsx';

export function VoteCard({ food, onVote, disabled, cardStyle }) {
    return (
        <button
            type="button"
            className={`vote-card ${cardStyle}`}
            onClick={() => onVote(food)}
            disabled={disabled}
        >
            <div className='food-card-image-wrapper'>
                <FoodImage
                    src={food.imageUrl}
                    alt={food.name}
                />
            </div>
            <div className='food-name'>
                <h2>{food.name}</h2>
            </div>
        </button>
    );
}

export default VoteCard;