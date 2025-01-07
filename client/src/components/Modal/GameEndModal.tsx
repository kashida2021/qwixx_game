import { Socket } from "socket.io-client"
import "./Modal.css";

interface IGameEndModal {
    socket: Socket;
    lobbyId: string;
    userId: string;
    members: string[];
    gameSummary: any;
}

export const GameEndModal: React.FC<IGameEndModal> = ({
    socket,
    lobbyId,
    userId,
    members,
    gameSummary,
}) => {

    console.log("gameSummary before sorting", gameSummary);
    const endGameResults = Array.isArray(gameSummary.scores)
        ? [...gameSummary.scores].sort((a, b) => b.total - a.total)
        : [];

    console.log("endGameResults after sorting", endGameResults);
    
    const rankedResults = endGameResults.map((player, index, array) => {
        const rank = index > 0 && player.total === array[index-1].total ? array[index-1].rank : index + 1;
        return {...player, rank};
    })

    console.log("ranked results are:", rankedResults);

    return(
        <div className="modal">
            <div className="overlay"></div>
            <div className="modal__endGame-content">
                <h2>Game End Summary: Lobby {lobbyId}</h2>
                <h3> Winner is {gameSummary.winners}</h3>
                <table className="modal__endGame-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankedResults.map((player, index)=> (
                            <tr key={index}>
                                <td>{player.rank}</td>
                                <td>{player.name}</td>
                                <td>{player.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="modal__endGame-btnContainer">
                    <button>Play Again</button>
                    <button>Leave Game</button>
                </div>
            </div>
        </div>
    )

};

