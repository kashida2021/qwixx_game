import "./GamePage.css";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import GameCard from "../../components/GameCard/GameCard";
//import { GameCardData } from "../../types/GameCardData";
import { QwixxLogic } from "../../types/qwixxLogic";
// import GameBoard from "../../../../shared/GameBoard";
// import { SetStateAction, Dispatch } from "react";
// import { rowColour} from "../../../../shared/types";
import DiceContainer from "../../components/Dice/DiceContainer";
import ScoreGuideTable from "../../components/ScoreGuideTable/ScoreGuideTable";
//import { MoveAvailability } from "../../types/GameCardData";
import { GameEndModal } from "../../components/Modal/GameEndModal";
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
  availableMoves: boolean;
  isGameEnd: boolean;
  gameSummary: any;
  setMembers: Dispatch<SetStateAction<string[]>>;
  setNotifications: Dispatch<SetStateAction<string[]>>;
  setGamePath: Dispatch<SetStateAction<string>>;
  setGameState: Dispatch<SetStateAction<QwixxLogic | null>>;
  setGameSummary: Dispatch<SetStateAction<any>>;
  setIsGameActive: Dispatch<SetStateAction<boolean>>;
  setIsGameEnd: Dispatch<SetStateAction<boolean>>;
  // setGameBoardState: Dispatch<SetStateAction<GameBoard | null>>;
}

export const Game: React.FC<IGameProps> = ({
  lobbyId,
  userId,
  members,
  gameState,
  socket,
  availableMoves,
  isGameEnd,
  gameSummary,
  setMembers,
  setNotifications,
  setGamePath,
  setGameState,
  setIsGameActive,
  setGameSummary,
  setIsGameEnd,
  
}) => {
  const [playerChoice, setPlayerChoice] = useState<{
    row: string;
    num: number;
  } | null>(null);

  const [submissionCount, setSubmissionCount] = useState<number>(0);

  useEffect(() => {
    setSubmissionCount(0);
  }, [gameState.activePlayer]);
  //  useEffect(() => {
  //    console.log(playerChoice);
  //  }, [playerChoice]);
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
  const hasSubmitted = gameState.players[userId].hasSubmittedChoice;
  const hasAvailableMoves = availableMoves;
  const hasRolled = gameState.hasRolled;
  const activePlayer = gameState.activePlayer;

  console.log("player has moves:", hasAvailableMoves);

  const handleCellClick = (rowColour: string, num: number) => {
    setPlayerChoice({ row: rowColour, num });
  };

  const handleNumberSelection = () => {
    socket.emit("mark_numbers", { lobbyId, userId, playerChoice }, (isSuccessful: boolean) => {
      if (isSuccessful) {
        setSubmissionCount((prev) => prev + 1);
      } else {
        console.log("move not successful");
      }
    });
    //console.log("player's choice:", playerChoice);
  }

  const handlePenalty = () => {
    socket.emit("submit_penalty", { userId, lobbyId });
  }

  const handlePassMove = () => {
    socket.emit("pass_move", { lobbyId, userId });
    setSubmissionCount((prev) => prev + 1);
  }

  const handleEndTurn = () => {
    socket.emit("end_turn", { lobbyId, userId })
    setSubmissionCount(0);
  }

  const handleLockRow = (rowColour: string) => {
    socket.emit("lock_row", { userId, lobbyId, rowColour })
  }

  console.log(gameSummary);

  return (
    <div className="game-page-container">
      {/* Left hand dice zone */}
      <div className="left-side">
        <h1>Lobby: {lobbyId}</h1>
        <DiceContainer
          diceState={gameState.dice}
          socket={socket}
          lobbyId={lobbyId}
          gameState={gameState}
          userId={userId}
        />
      </div>
      <div className="game-card-container">
        {/* Opponents' game cards */}
        <div
          className="opponent-zone"
          id="opponentZone"
          aria-label="opponent-zone"
        >
          {filteredMembers.map((member, index) => (
            <GameCard
              key={index}
              member={member}
              isOpponent={true}
              gameCardData={gameState.players[member].gameCard}
              cellClick={handleCellClick}
              handleLockRow={handleLockRow}
            />
          ))}
        </div>
        {/* Player's game card */}
        <div className="player-zone" id="playerZone" aria-label="player-zone">
          <GameCard
            member={userId}
            isOpponent={false}
            gameCardData={gameState.players[userId].gameCard}
            cellClick={handleCellClick}
            handleLockRow={handleLockRow}
          />
          <ScoreGuideTable />
          {!hasAvailableMoves && !hasSubmitted && hasRolled && activePlayer === userId ? (
            <button className="penalty-btn" onClick={handlePenalty}>Accept Penalty</button>
          ) :
            (<button onClick={handleNumberSelection} disabled={hasSubmitted}>Confirm</button>)
          }
          {/* For ending a turn even if there are available moves */}
          <button className="" onClick={handleEndTurn} disabled={hasSubmitted || !hasRolled}>End Turn</button>
          {/* Possibly need to update structure of data sent back from backend to include submission count to disable button on 2nd choice rather than hasSubmitted */}
          <button className="" onClick={handlePassMove} disabled={hasSubmitted || !hasRolled || activePlayer !== userId || submissionCount > 0}>Pass Move</button>
        </div>
      </div>
      {/* Temporarily putting this here so we can see who is the winner*/}
      <div className="game-page__game-summary">
        {isGameEnd ? (
          <GameEndModal
            socket={socket}
            lobbyId={lobbyId}
            userId = {userId}
            members = {members}
            gameSummary = {gameSummary}
            setNotifications = {setNotifications}
            setMembers = {setMembers}
            setGameState={setGameState}
            setGamePath={setGamePath}
            setIsGameActive={setIsGameActive}
            setGameSummary={setGameSummary}
            setIsGameEnd={setIsGameEnd}
          />): (<p></p>)}
      </div>
    </div>
  );
};

export default Game;
