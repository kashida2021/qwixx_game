import { initializePlayers } from "../../models/InitializePlayer";
import GameBoard from "../../models/GameBoardTemp";
const mockGameCard1 = new GameBoard;
const mockGameCard2 = new GameBoard;;
const mockGameCard3 = new GameBoard;;
const mockGameCard4 = new GameBoard;;

describe("initializePlayers tests", () => {
  test("given 1 player name, it returns an error", () => {
    const mockPlayerNames: string[] = ["player1"];
    const mockGameCards = [mockGameCard1];
    expect(() => initializePlayers(mockPlayerNames, mockGameCards)).toThrow(
      "There must be atleast 2 players in the room"
    );
  });

  test("returns an error if length of scoreBoards doesn't match playerNames", () => {
    const mockPlayerNames: string[] = ["player1", "player2"];
    const mockGameCards = [mockGameCard1];
    expect(() => initializePlayers(mockPlayerNames, mockGameCards)).toThrow(
      "The number of players and score boards don't match"
    );
  });

  test("given 2 player names, it returns an array of Player Objects of length 2", () => {
    const mockPlayerNames = ["player1", "player2"];
    const mockGameCards = [mockGameCard1, mockGameCard2];
    const result = initializePlayers(mockPlayerNames, mockGameCards);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("player1");
    expect(result[1].name).toBe("player2");
  });

  test("given 4 player names, it returns an array of Player Objects of length 4 ", () => {
    const mockPlayerNames = ["player1", "player2", "player3", "player4"];
    const mockGameCards = [
      mockGameCard1,
      mockGameCard2,
      mockGameCard3,
      mockGameCard4,
    ];
    const result = initializePlayers(mockPlayerNames, mockGameCards);
    expect(result.length).toBe(4);
    for (let i = 0; i < result.length; i++) {
      const playerName = result[i];
      expect(playerName).toBeDefined();
      expect(playerName.name).toBe(`player${i + 1}`);
      expect(playerName.gameCard instanceof GameBoard).toBe(true);
    }
  });
});
