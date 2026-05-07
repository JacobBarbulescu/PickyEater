// Eli — Game over screen shown when player guesses wrong or runs out of time
import FoodCard from './FoodCard.jsx';

const GameOver = ({
    timedOut,
    finalScore,
    bestScore,
    isNewHighScore,
    onPlayAgain,
    food1,
    food2,
    getBorderStyle,
    getIsCorrect
}) => {
    return (
        <div className="game-over-card">
            <h1>Game Over!</h1>

            {timedOut ? (
                <p>You Ran Out of Time!</p>
            ) : (
                <p>Wrong Answer!</p>
            )}

            {isNewHighScore ? (
                <p>New Best Score of {bestScore}!</p>
            ) : (
                <p>Best: {bestScore}</p>
            )}

            <p>Final Score: {finalScore}</p>

            <button onClick={onPlayAgain}>Play Again</button>
        </div>
    );
};

export default GameOver;