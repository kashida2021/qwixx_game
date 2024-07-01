import GameBoard from "./GameBoardTemp";

export const initializeScoreBoards = (
  playerNames: string[]
): GameBoard[] => {
  if (playerNames.length < 2) {
    throw new Error(
      "There must be at least 2 players to generate score boards"
    );
  }

  const gameBoards: GameBoard[] = [];

  playerNames.forEach(() => {
    const gameBoard = new GameBoard(); 
    gameBoards.push(gameBoard);
  });

  return gameBoards;
};
