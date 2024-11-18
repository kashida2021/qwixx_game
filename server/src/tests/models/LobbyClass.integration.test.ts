import Lobby from "../../models/LobbyClass";

describe("Lobby Class integration tests", () => {
  describe("Dice roll tests", () => {
    it("should roll dice and return dice value", () => {
      const testLobby = new Lobby("1234");
      testLobby.addPlayer("John");
      testLobby.addPlayer("Fred");

      testLobby.startGame();

      const res = testLobby.gameLogic?.rollDice();

      if (!res) {
        throw new Error("Dice is undefined.");
      }

      Object.values(res.diceValues).forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(6);
      });
    });

    test("hasRolled state should be true after rolling the dice", () => {
      const testLobby = new Lobby("1234");
      testLobby.addPlayer("John");
      testLobby.addPlayer("Fred");

      testLobby.startGame();

      const res = testLobby.gameLogic?.rollDice();

      if (!res) {
        throw new Error("Dice is undefined.");
      }

      expect(res.hasRolled).toBeTruthy()
    })

    it("should return whether the active player has available moves or not", () => {
      const testLobby = new Lobby("1234");
      testLobby.addPlayer("John");
      testLobby.addPlayer("Fred");

      testLobby.startGame();

      const res = testLobby.gameLogic?.rollDice();

      if (!res) {
        throw new Error("Dice is undefined.");
      }

      expect(res.hasAvailableMoves).toBeTruthy()
    })
  });
});
