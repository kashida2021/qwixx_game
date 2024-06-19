import { initializePlayers } from "../../models/InitializePlayer";

const mockScoreBoard1 = {};
const mockScoreBoard2 = {};
const mockScoreBoard3 = {};
const mockScoreBoard4 = {};

describe("initializePlayers tests", () => {
  test("given 1 player name, it returns an error", () => {
    const mockPlayerNames: string[] = ["player1"];
    const mockScoreBoards = [mockScoreBoard1];
    expect(() => initializePlayers(mockPlayerNames, mockScoreBoards)).toThrow(
      "There must be atleast 2 players in the room"
    );
  });

  test("returns an error if length of scoreBoards doesn't match playerNames", () => {
    const mockPlayerNames: string[] = ["player1", "player2"];
    const mockScoreBoards = [mockScoreBoard1];
    expect(() => initializePlayers(mockPlayerNames, mockScoreBoards)).toThrow(
      "The number of players and score boards don't match"
    );
  });

  test("given 2 player names, it returns an array of Player Objects of length 2", () => {
    const mockPlayerNames = ["player1", "player2"];
    const mockScoreBoards = [mockScoreBoard1, mockScoreBoard2];
    const result = initializePlayers(mockPlayerNames, mockScoreBoards);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("player1");
    expect(result[1].name).toBe("player2");
  });

  test("given 4 player names, it returns an array of Player Objects of length 4 ", () => {
    const mockPlayerNames = ["player1", "player2", "player3", "player4"];
    const mockScoreBoards = [
      mockScoreBoard1,
      mockScoreBoard2,
      mockScoreBoard3,
      mockScoreBoard4,
    ];
    const result = initializePlayers(mockPlayerNames, mockScoreBoards);
    expect(result.length).toBe(4);
    for (let i = 0; i < result.length; i++) {
      const playerName = result[i];
      expect(playerName).toBeDefined();
      expect(playerName.name).toBe(`player${i + 1}`);
      expect(playerName.scoreCard).toEqual({});
    }
  });
});
