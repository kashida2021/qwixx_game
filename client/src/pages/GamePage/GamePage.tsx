import "./GamePage.css";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import GameCard from "../../components/GameCard/GameCard";
//import { GameCardData } from "../../types/GameCardData";
import { QwixxLogic } from "../../types/qwixxLogic";
// import GameBoard from "../../../../shared/GameBoard";
// import { SetStateAction, Dispatch } from "react";
// import { rowColour} from "../../../../shared/types";

//interface GameState {
  //players: {
    //[playerId: string]: GameCardData 
  //}
//}

interface IGameProps {
  socket: Socket;
  lobbyId: string;
  userId: string;
  members: string[];
  gameState: QwixxLogic;
  // setGameBoardState: Dispatch<SetStateAction<GameBoard | null>>;
}

export const Game: React.FC<IGameProps> = ({ lobbyId, userId, members, gameState, socket }) => {
  
  const [playerChoice, setPlayerChoice] = useState<{row: string; num:number} | null>(null);
  const handleCellClick = (rowColour: string, num: number) => {
    setPlayerChoice({row: rowColour, num});
  }

  useEffect(() => {
    console.log(playerChoice);
  }, [playerChoice]);
  // if(!gameState){
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

  const handleNumberSelection = () => {
    socket.emit("mark_numbers", {lobbyId, userId, playerChoice});
    console.log("player's choice:", playerChoice);
  }

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
            <GameCard key={index} member={member} isOpponent={true} gameCardData={gameState.players[member]} cellClick={handleCellClick}/>
          ))}
        </div>
				{/* Player's game card */}
        <div className="player-zone" id="playerZone" aria-label="player-zone">
          <GameCard member={userId} isOpponent={false} gameCardData={gameState.players[userId]} cellClick={handleCellClick}/>
          <button
          onClick={handleNumberSelection}
          >Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Game;
