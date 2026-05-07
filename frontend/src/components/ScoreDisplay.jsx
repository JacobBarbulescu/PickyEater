// Eli — animated +1 / correct/wrong reveal shown after each game guess
import { useEffect, useState } from 'react';

const ScoreDisplay = ({ score, result, timeLeft, bestScore }) => {
    const [prevScore, setPrevScore] = useState(score);
    const [scoreFlash, setScoreFlash] = useState('');

    useEffect(() => {
        if (score > prevScore) {
            setScoreFlash('score-flash');
            setTimeout(() => setScoreFlash(''), 600);
        }
        setPrevScore(score);
    }, [score]);

    const timeColor = timeLeft <= 3 ? 'time-critical' : timeLeft <= 6 ? 'time-warning' : 'time-ok';

    return (
        <div className="score-display">
            <div className="score-section">
                <div className={`score-value ${scoreFlash}`}>
                    {score}
                </div>
                <div className="score-label">Score</div>
            </div>

            <div className="timer-section">
                {!result && (
                    <>
                        <div className={`timer-value ${timeColor}`}>
                            {timeLeft}
                        </div>
                        <div className="score-label">Seconds</div>
                    </>
                )}
                {result && (
                    <div className={`result-message ${result.tie ? 'result-tie' : result.correct ? 'result-correct' : 'result-wrong'}`}>
                        {result.tie ? 'Tie!' : result.correct ? 'Correct!' : 'Wrong!'}
                    </div>
                )}
            </div>

            <div className="score-section">
                <div className="score-value best">
                    {bestScore}
                </div>
                <div className="score-label">Best</div>
            </div>
        </div>
    );
};

export default ScoreDisplay;