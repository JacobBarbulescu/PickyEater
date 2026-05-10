// Jacob — ranked table; accepts a list prop so it works for both foods and players
import { Link } from 'react-router-dom';

function LeaderboardTable({ type, items }) {
    return (
        <div className="admin-list">
            {type === "users" ?
                (
                    //Users
                    items.map((user, index) => (
                        <div key={index} className='admin-item'>
                            <span>{user.username}</span>
                            <span>High Score: {user.bestScore}</span>
                            <span>Total Votes Cast: {user.numVotes}</span>
                            <Link to={`/users/${user.id}`}>View Profile</Link>
                        </div>
                    ))
                )
                :
                (
                    //Food
                    items.map((food, index) => (
                        <div key={index} className='admin-item'>
                            <span>{food.name}</span>
                            <img src={food.imageUrl} style={{ width: '100px', height: '100px' }} alt={food.name} />
                            <span>Wins: {food.wins}</span>
                            <span>Total Votes: {food.totalVotes}</span>
                            <span>Win Rate: {food.winRate}</span>
                        </div>
                    ))
                )
            }
        </div>
    );
}

export default LeaderboardTable;