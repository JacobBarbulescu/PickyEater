// Displays a food image + name; used in search results and game screens
const FoodCard = ({ food, onClick, borderStyle, showVotes, isCorrect, isTie }) => {
    const winPercent = food.totalVotes > 0
        ? ((food.wins / food.totalVotes) * 100).toFixed(2)
        : '0.00';

    return (
        <div onClick={onClick} className={borderStyle}>
            <div className="food-card-image-wrapper">
                <img 
                    src={food.imageUrl} 
                    alt={food.name}
                    onError={(e) => {
                        e.target.src = 'https://placehold.co/300x200?text=Unable+to+Load+Image';
                    }}
                />
                {showVotes && (
                    <div className={`win-banner ${isTie ? 'banner-tie' : isCorrect ? 'banner-correct' : 'banner-wrong'}`}>
                        {winPercent}% Win Rate
                    </div>
                )}
            </div>
            <div className="food-name">
                <h2>{food.name}</h2>
            </div>
        </div>
    );
};

export default FoodCard;