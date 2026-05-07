// Jackson — clickable food card for the would-you-rather voting UI
import React from 'react';

export function VoteCard({ food, onVote, disabled, cardStyle}) {
    return (
        <button
            type='button'
            className= {`voteCard ${cardStyle}`}
            onClick={() => onVote(food)}
            disabled={disabled}
        >   
            <img src={food.imageUrl} alt={food.name} />
            <h2>{food.name}</h2>
        </button>
    );
}

export default VoteCard;