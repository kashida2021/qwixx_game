import { initializeScoreBoards } from "../../models/InitializeScoreBoard";

describe("initializeScoreBoards tests", () => {
  test("given 2 player names, it returns an array of 2 ScoreBoard objects", () => {
    const scoreBoardsArray = initializeScoreBoards(["player1", "player2"]);
    expect(scoreBoardsArray.length).toBe(2);
  });

  test("given 1 player name, it throws an error", () => {
    expect(() => initializeScoreBoards(["player1"])).toThrow(
      "There must be at least 2 players to generate score boards"
    );
  });

  test("given 0 player name, it throws an error", () => {
    expect(() => initializeScoreBoards([])).toThrow(
      "There must be at least 2 players to generate score boards"
    );
  });
});
