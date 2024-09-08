import Lobby from "../../models/LobbyClass";

describe("Lobby Class integration tests", () => {
  it("should roll dice and return dice values", () => {
    const testLobby = new Lobby("1234");
    testLobby.addPlayer("John");
    testLobby.addPlayer("Fred");

    testLobby.startGame();

    const diceValues = testLobby.rollDice();

    if (!diceValues) {
      throw new Error("Dice is undefined.");
    }

    Object.values(diceValues).forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    });
  });
});
