// Eli — animated +1 / correct/wrong reveal shown after each game guess
import { useEffect, useState } from 'react';

const ScoreDisplay = ({ score, result, timeLeft, bestScore }) => {
    const [showDelta, setShowDelta] = useState(false);

    useEffect(() => {
        if (result) {
            setShowDelta(true);
            const timer = setTimeout(() => setShowDelta(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [result]);

    return (
        <div>
            <p>Score: {score}</p>
            <p>Best Score: {bestScore}</p>
            {!result && <p>Time Left: {timeLeft}</p>}
            {result && (
                <div>
                    {!result.tie && <p>{result.correct ? 'Correct!' : 'Wrong!'}</p>}
                </div>
            )}
        </div>
    );
};

export default ScoreDisplay;