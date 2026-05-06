// Eli — animated +1 / correct/wrong reveal shown after each game guess
import { useEffect, useState } from 'react';

const ScoreDisplay = ({ score, result, timeLeft, bestScore }) => {
    return (
        <div>
            <p>Score: {score}</p>
            <p>Best Score: {bestScore}</p>
            {!result && <p>Time Left: {timeLeft}</p>}
            {result && (
                <div>
                    {result && result.tie && <p>It's a Tie! No points awarded.</p>}
                    {result && !result.tie && !result.correct && <p>Wrong!</p>}
                    {result && !result.tie && result.correct && <p>Correct!</p>}
                </div>
            )}
        </div>
    );
};

export default ScoreDisplay;