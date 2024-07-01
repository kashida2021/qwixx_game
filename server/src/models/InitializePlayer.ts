import Player from "./PlayerClass";
import qwixxBaseGameCard from "./QwixxBaseGameCard";

export const initializePlayers = (
  playerNames: string[],
  gameCards: qwixxBaseGameCard[],
): Player[] => {
  if (playerNames.length < 2) {
    throw new Error("There must be atleast 2 players in the room");
  }
  
  if(playerNames.length !== gameCards.length){
    throw new Error("The number of players and score boards don't match"); 
  }

  
  const playerArray: Player[] = [];

  playerNames.forEach((playerName, index) => {
    const playerObject = new Player(playerName, gameCards[index]);
    playerArray.push(playerObject);
  });
  return playerArray;
};
