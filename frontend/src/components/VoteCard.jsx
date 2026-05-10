// Jackson — clickable food card for the would-you-rather voting UI
import React from 'react';
import FoodImage from './FoodImage.jsx';

export function VoteCard({ food, onVote, disabled }) {
    return (
        <button
            type='button'
            className='voteCard'
            onClick={() => onVote(food)}
            disabled={disabled}
        >
            <FoodImage src={food.imageUrl} alt={food.name} />
            <h2>{food.name}</h2>
        </button>
    );
}

export default VoteCard;