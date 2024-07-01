import qwixxBaseGameCard from "./QwixxBaseGameCard";

export const initializeGameCards = (
  playerNames: string[]
): qwixxBaseGameCard[] => {
  if (playerNames.length < 2) {
    throw new Error(
      "There must be at least 2 players to generate score boards"
    );
  }

  const gameCards: qwixxBaseGameCard[] = [];

  playerNames.forEach(() => {
    const gameCard = new qwixxBaseGameCard(); 
    gameCards.push(gameCard);
  });

  return gameCards;
};
