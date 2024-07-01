import { initializeGameCards } from "../../models/InitializeScoreBoard";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";

describe("initializeGameCards tests", () => {
  test("given 2 player names, it returns an array of 2 ScoreBoard objects", () => {
    const gameCardsArray = initializeGameCards(["player1", "player2"]);
    gameCardsArray.forEach((scoreBoard) => {
      expect(scoreBoard instanceof qwixxBaseGameCard).toBe(true); 
    })
    expect(gameCardsArray.length).toBe(2);
  });

  test("given 1 player name, it throws an error", () => {
    expect(() => initializeGameCards(["player1"])).toThrow(
      "There must be at least 2 players to generate score boards"
    );
  });

  test("given 0 player name, it throws an error", () => {
    expect(() => initializeGameCards([])).toThrow(
      "There must be at least 2 players to generate score boards"
    );
  });
});
