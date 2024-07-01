import Player from "./PlayerClass";
import GameBoard from "./GameBoardTemp";

export const initializePlayers = (
  playerNames: string[],
  scoreBoards: GameBoard[],
): Player[] => {
  if (playerNames.length < 2) {
    throw new Error("There must be atleast 2 players in the room");
  }
  
  if(playerNames.length !== scoreBoards.length){
    throw new Error("The number of players and score boards don't match"); 
  }

  
  const playerArray: Player[] = [];

  playerNames.forEach((playerName, index) => {
    const playerObject = new Player(playerName, scoreBoards[index]);
    playerArray.push(playerObject);
  });
  return playerArray;
};
