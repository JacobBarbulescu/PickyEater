// Jackson — clickable food card for the would-you-rather voting UI
import React from 'react';

export function VoteCard({ food, onVote, disabled, cardStyle}) {
    return (
        <button
            type="button"
            className={`vote-card ${cardStyle}`}
            onClick={() => onVote(food)}
            disabled={disabled}
            >
                <div className='food-card-image-wrapper'>
                    <img 
                        src={food.imageUrl} 
                        alt={food.name} 
                        onError={(e) => {
                            e.target.src='https://placehold.co/300x200?text=Unable+to+Load+Image';
                        }}
                    />
                </div>
                <div className='food-name'>
                    <h2>{food.name}</h2>
                </div>
            </button>
    );
}

export default VoteCard;