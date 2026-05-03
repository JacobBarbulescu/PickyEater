// Eli — Game over screen shown when player guesses wrong or runs out of time
import FoodCard from './FoodCard.jsx';

const GameOver = ({ timedOut, finalScore, onPlayAgain, food1, food2, getBorderStyle, getIsCorrect }) => {
    return (
        <div>
            <h1>Game Over!</h1>
            {timedOut
                ? <p>You ran out of time!</p>
                : <p>Wrong answer!</p>
            }
            <p>Final Score: {finalScore}</p>
            <button onClick={onPlayAgain}>Play Again</button>
            <div className="food-cards-wrapper">
                <div className="food-cards">
                    {[food1, food2].map((food) => (
                        <FoodCard
                            key={food._id}
                            food={food}
                            onClick={null}
                            borderStyle={getBorderStyle(food)}
                            showVotes={true}
                            isCorrect={getIsCorrect(food)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameOver;