// Eli — main PickyEater game: shows two foods, user picks most popular, reveals result + score delta
import { useState, useEffect, useRef } from 'react';
import { getGameRound, submitGuess, getBestScore } from '../api/index.js';
import { useAuth } from '../hooks/useAuth.js';
import FoodCard from '../components/FoodCard.jsx';
import ScoreDisplay from '../components/ScoreDisplay.jsx';
import { useLocation } from 'react-router-dom';
import GameOver from '../components/GameOver.jsx';

const COUNTDOWN = 10;

const Game = () => {
    const { currentUser } = useAuth();
    const [food1, setFood1] = useState(null);
    const [food2, setFood2] = useState(null);
    const [result, setResult] = useState(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [guessedFoodId, setGuessedFoodId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN);
    const [timedOut, setTimedOut] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [flash, setFlash] = useState('');
    const [showPlusOne, setShowPlusOne] = useState(false);
    const [showWrong, setShowWrong] = useState(false);
    const [correctFoodId, setCorrectFoodId] = useState(null);
    const timerRef = useRef(null);
    const food1Ref = useRef(null);
    const food2Ref = useRef(null);
    const scoreRef = useRef(0);
    const location = useLocation();
    const [bestScore, setBestScore] = useState(0);


    // keep scoreRef in sync so timer can access latest score
    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    // Game Timer logic
    const clearTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // Game Timer logic
    const startTimer = () => {
        clearTimer();
        setTimeLeft(COUNTDOWN);
        setTimedOut(false);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    const f1 = food1Ref.current;
                    const f2 = food2Ref.current;
                    if (f1 && f2) {
                        const f1WinRate = f1.wins / (f1.totalVotes + 1);
                        const f2WinRate = f2.wins / (f2.totalVotes + 1);
                        setCorrectFoodId(
                            f1WinRate >= f2WinRate
                                ? f1._id.toString()
                                : f2._id.toString()
                        );
                    }
                    setTimedOut(true);
                    setFinalScore(scoreRef.current);
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Gets 2 random foods for the round
    const fetchRound = async () => {
        setLoading(true);
        setResult(null);
        setGuessedFoodId(null);
        setCorrectFoodId(null);
        setError(null);
        setTimedOut(false);
        clearTimer();
        try {
            const res = await getGameRound();
            food1Ref.current = res.data[0];
            food2Ref.current = res.data[1];
            setFood1(res.data[0]);
            setFood2(res.data[1]);
            startTimer();
        } catch (e) {
            setError('Could not load foods. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Sets everything needed to start the game
    const startNewGame = () => {
        setScore(0);
        scoreRef.current = 0;
        setGameOver(false);
        setFinalScore(0);
        setResult(null);
        setGuessedFoodId(null);
        setCorrectFoodId(null);
        fetchRound();
    };

    // Resets game when naviagating to page
    useEffect(() => {
        setScore(0);
        scoreRef.current = 0;
        setGameOver(false);
        setFinalScore(0);
        setResult(null);
        setGuessedFoodId(null);
        setCorrectFoodId(null);
        setFlash('');
        fetchRound();
        return () => clearTimer();
    }, [location.key]);

    // Fetch best score
    useEffect(() => {
        const fetchBestScore = async () => {
            try {
                const res = await getBestScore(currentUser.id);
                setBestScore(res.data.bestScore);
            } catch (e) {
                console.error('Could not fetch best score');
            }
        };
        fetchBestScore();
    }, []);

    // Handles if player guess correctly or incorrectly accordingly
    const handleGuess = async (guessedFood) => {
        if (result || timedOut || gameOver) return;
        clearTimer();
        setGuessedFoodId(guessedFood._id);
        try {
            // Player guess
            const res = await submitGuess(
                currentUser.id,
                guessedFood._id,
                food1._id,
                food2._id,
                score
            );
            setResult(res.data);

            // Tie
            if (res.data.tie) {
                return;
            }

            // Correct
            if (res.data.correct) {
                setScore(prev => {
                    const newScore = prev + 1;
                    if (newScore > bestScore) setBestScore(newScore);
                    return newScore;
                });
                setCorrectFoodId(res.data.correctFoodId);
                setFlash('flash-correct');
                setShowPlusOne(true);
                setTimeout(() => setShowPlusOne(false), 800);
                setTimeout(() => setFlash(''), 600);

            // Incorrect
            } else {
                setCorrectFoodId(res.data.correctFoodId);
                setFinalScore(scoreRef.current);
                setFlash('flash-wrong');
                setShowWrong(true);
                setTimeout(() => {
                    setShowWrong(false);
                    setFlash('');
                    setGameOver(true);
                }, 800);
            }
        } catch (e) {
            setError('Could not submit guess. Try again.');
        }
    };

    // Allows styling depending on if the answer is correct, wrong, or no answer given yet
    const getBorderStyle = (food) => {
        if (!result && !gameOver) return '';
        const foodIdStr = food._id.toString();
        if (foodIdStr === guessedFoodId?.toString()) return 'guessed';
        if (foodIdStr === correctFoodId?.toString()) return 'correct';
        return '';
    };

    const getIsCorrect = (food) => {
        if (!correctFoodId) return false;
        return food._id.toString() === correctFoodId.toString();
    };

    if (!currentUser) return <div>Please log in to play.</div>;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Game over screen
    if (gameOver && !flash) {
        return (
            <GameOver
                timedOut={timedOut}
                finalScore={finalScore}
                onPlayAgain={startNewGame}
                food1={food1}
                food2={food2}
                getBorderStyle={getBorderStyle}
                getIsCorrect={getIsCorrect}
            />
        );
    }

    return (
        <div className={`game-page ${flash}`}>
            <h1>PickyEater</h1>
            <p>Which food is more popular?</p>

            <ScoreDisplay
                score={score}
                result={result}
                timeLeft={timeLeft}
                bestScore={bestScore}
            />

            {result && result.tie && (
                <div>
                    <p>It's a Tie! No points awarded.</p>
                    <button onClick={fetchRound}>Next Round</button>
                </div>
            )}

            {result && result.correct && (
                <div>
                    <button onClick={fetchRound}>Next Round</button>
                </div>
            )}

            <div className="food-cards-wrapper">
                {showPlusOne && <div className="plus-one">+1</div>}
                {showWrong && <div className="wrong-overlay">X</div>}
                <div className="food-cards">
                    {[food1, food2].map((food) => (
                        <FoodCard
                            key={food._id}
                            food={food}
                            onClick={result || timedOut ? null : () => handleGuess(food)}
                            borderStyle={getBorderStyle(food)}
                            showVotes={!!result}
                            isCorrect={getIsCorrect(food)}
                            isTie={result?.tie || false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Game;