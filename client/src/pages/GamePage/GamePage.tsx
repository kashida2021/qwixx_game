import { Socket } from "socket.io-client";
import GameCard from "../../components/gameCard/gameCard";
// import GameBoard from "../../../../shared/GameBoard";
// import { SetStateAction, Dispatch } from "react";
// import { rowColour} from "../../../../shared/types";

interface IGameProps {
    socket: Socket;
    lobbyId: string;
    userId: string;
    members: string[];
    // gameBoardState: GameBoard | null;
    // setGameBoardState: Dispatch<SetStateAction<GameBoard | null>>;
}

export const Game: React.FC<IGameProps> = ({lobbyId, userId, members}) => {
    // console.log('Rendering Game component', { lobbyId, userId, members });
    // if(!gameBoardState){
    //     return <div>Loading...</div>;
    // }
    console.log(userId)
    console.log(members)
    // prob need to create a local state and localgameboard instance to toggle 
    // if number is active or not to allow clients to make selection 
    // seperate button to submit their choice which then updates the gameboard instance 
    // currently when clicking on button it will update markednumbers and disable button

    // const boardNumbers = gameBoardState?.getNumbers() || [];
    // const markedNumbers = gameBoardState?.getMarkedNumbers() || {};
    // const handleClick = (colour: rowColour, number: number) => {
    //     if(!gameBoardState) return;
        
    //     gameBoardState.markNumbers(colour, number);

    //     setGameBoardState(gameBoardState);
    // }


    return (
        <div>
            <h1>Lobby: {lobbyId}</h1>

            {/* Other user's game cards */}


            {/* This user's game card */}
            {/* {(Object.values(rowColour) as rowColour[]).map(colour => (
                <div key={colour} className={`${colour} row`}>
                    {boardNumbers.map(number => (
                        <button key={number} onClick={() => handleClick(colour, number)} disabled={markedNumbers[colour]?.includes(number)}>{number}</button>
                    ))}
                </div>
            ))} */}
            <div className="active_players_board">
                <GameCard/>
            </div>
        </div>
        
    );
}

export default Game;