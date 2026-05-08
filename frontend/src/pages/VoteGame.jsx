// Jackson — would-you-rather voting mode; Socket.io updates leaderboard in real time
import {useEffect,useState} from 'react';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import VoteCard from '../components/VoteCard';


function VoteGame() {
    const {currentUser} = useAuth();
    const socket = useSocket();

    const [foodOne, setFoodOne] = useState(null);
    const [foodTwo, setFoodTwo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [selectedFood, setSelectedFood] = useState(null);
    const [voteComplete, setVoteComplete] = useState(false);
    const [flash, setFlash] = useState('');

    async function getPair(){
        try{
            setLoading(true);
            setError(null);
            setSelectedFood(null)
            setVoteComplete(false)
            setFlash('')

            const response = await api.get('/votes/pair');
            setFoodOne(response.data[0]);
            setFoodTwo(response.data[1]);

            setLoading(false);
            setSubmitting(false);
        } catch(e){
            setError('Failed to load food pair. Please try again.');
            setLoading(false);
            setSubmitting(false);
        }
    }

    useEffect(() => {
        getPair();
    }, []);

    useEffect(() => {
        if(!socket) return;

        function handleVoteCreated(){
            setSubmitting(false)
            setVoteComplete(true)
            setFlash('flash-correct')

            setTimeout(() => {
                setFlash('');
            }, 600)
        }

        function handleVoteError(data){
            setError(data.error);
            setSubmitting(false);
        }

        socket.on('voteCreated', handleVoteCreated);
        socket.on('voteError', handleVoteError);

        return () => {
            socket.off('voteCreated', handleVoteCreated);
            socket.off('voteError', handleVoteError);
        }
    }, [socket]);
    
    function handleVote(pickedFood){
        if (!socket || !currentUser || !foodOne || !foodTwo || submitting || voteComplete) return;

        let loseFood 
        if (pickedFood._id === foodOne._id) {
            loseFood = foodTwo;
        } else {
            loseFood = foodOne;
        }

        setSelectedFood(pickedFood._id);
        setSubmitting(true);
        setError(null);

        socket.emit('createVote', {
            userId: currentUser.id,
            winFoodId: pickedFood._id,
            lossFoodId: loseFood._id
        });
    }

    function getVoteCardStyle(food){
        if (!selectedFood) return ''
        if (selectedFood === food._id) return 'guessed'
        return ''
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error){
        return(
            <div>
                <p>{error}</p>
                <button type="button" onClick={getPair}>
                    Try Again
                    </button>
            </div>
        )
    }

    if (!foodOne || !foodTwo) {
        return <div>No food pair available</div>;
    }

    return (
        <div className={`game-page ${flash}`}>
            <h1>Would You Rather?</h1>
            <p>Select a preferred food</p>

            {submitting && <p>Submitting vote...</p>}

            {voteComplete && 
                <button type="button" onClick={getPair}>
                    Next Vote
                </button>
                }
            <div className="food-cards-wrapper">
                <div className={`food-cards ${submitting ? 'fading' : ''}`}>
                    <VoteCard 
                        food={foodOne} 
                        onVote={handleVote} 
                        disabled={submitting || voteComplete} 
                        cardStyle={getVoteCardStyle(foodOne)}/>
                    <VoteCard 
                        food={foodTwo} 
                        onVote={handleVote} 
                        disabled={submitting || voteComplete} 
                        cardStyle={getVoteCardStyle(foodTwo)}/>
                </div>
            </div>
        </div>
    )
}
export default VoteGame;
