import "./GamePage.css";
import { Socket } from "socket.io-client";
import GameCard from "../../components/gameCard/GameCard";
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

export const Game: React.FC<IGameProps> = ({ lobbyId, userId, members }) => {
  // console.log('Rendering Game component', { lobbyId, userId, members });
  // if(!gameBoardState){
  //     return <div>Loading...</div>;
  // }

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

  const filteredMembers = members.filter((member) => member !== userId);

  return (
    <div>
      <h1>Lobby: {lobbyId}</h1>
      <div className="game-card-container">
				{/* Opponents' game cards */}
        <div
          className="opponent-zone"
          id="opponentZone"
          aria-label="opponent-zone"
        >
          {filteredMembers.map((member, index) => (
            <GameCard key={index} member={member} isOpponent={true}/>
          ))}
        </div>
				{/* Player's game card */}
        <div className="player-zone" id="playerZone" aria-label="player-zone">
          <GameCard member={userId} isOpponent={false}/>
        </div>
      </div>
    </div>
  );
};

export default Game;
