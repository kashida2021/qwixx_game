import QwixxLogic from "../../services/QwixxLogic";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Player from "../../models/PlayerClass";
import SixSidedDie from "../../models/SixSidedDieClass";
import Dice from "../../models/DiceClass";

let mockPlayersArray: Player[];
let mockDice: Dice;
let testGame: QwixxLogic;
describe("Qwixx Logic integration tests:", () => {
  beforeEach(() => {
    const mockgameCard1 = new qwixxBaseGameCard();
    const mockPlayer1 = new Player("test-player1", mockgameCard1);

    const mockgameCard2 = new qwixxBaseGameCard();
    const mockPlayer2 = new Player("test-player2", mockgameCard2);

    mockDice = new Dice(SixSidedDie);

    mockPlayersArray = [mockPlayer1, mockPlayer2];

    testGame = new QwixxLogic(mockPlayersArray, mockDice);
  });

  it("should return all players", () => {
    expect(testGame.players.length).toBe(2);
    testGame.players.forEach((player) => {
      expect(player.gameCard instanceof qwixxBaseGameCard).toBe(true);
    });
  });

  it("should make a move and return the correct result", () => {
    const testGame = new QwixxLogic(mockPlayersArray, mockDice);

    const gameState = testGame.makeMove("test-player1", "red", 1);
    if (typeof gameState === "object") {
      expect(gameState.players).toHaveProperty("test-player1");
      expect(gameState.players).toHaveProperty("test-player2");
      expect(gameState.players["test-player1"]).toHaveProperty("penalties", 0);
      expect(gameState.players["test-player2"]).toHaveProperty("penalties", 0);

      expect(gameState.dice).toMatchObject({
        white1: expect.any(Number),
        white2: expect.any(Number),
        red: expect.any(Number),
        yellow: expect.any(Number),
        green: expect.any(Number),
        blue: expect.any(Number),
      });
    }
  });

  it("should updated hasSubmitted when a player makes a move", () => {
    testGame.makeMove("test-player1", "red", 1);
    expect(testGame.players[0].hasSubmittedChoice).toBe(true);
  });

  it("should update haveAllPlayersSubmitted when every player has made a move", () => {
    testGame.makeMove("test-player1", "red", 1);
    testGame.makeMove("test-player2", "blue", 3);
    expect(testGame.haveAllPlayersSubmitted()).toEqual(true);
  });

  it("should return a message if the player isn't found when making a move", () => {
    const nonPlayerResult = testGame.makeMove("test-player3", "red", 1);
    expect(nonPlayerResult).toBe("Player not found");
  });

  it("should throw an error if colour doesn't exist in rowColour enum", () => {
    expect(() => {
      testGame.makeMove("test-player1", "orange", 1);
    }).toThrow("Invalid colour");
  });

  it("should roll all dice and return a value", () => {
    const diceValues = testGame.rollDice();
    Object.values(diceValues).forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    });
  });

  it("should update the hasRolled property to true once a dice has been rolled", () => {
    testGame.rollDice();
    expect(testGame.hasRolled).toBe(true);
  });

  it("should have an active player, which is the first player players array", () => {
    expect(testGame.currentPlayer.name).toBe("test-player1");
  });

  it("should change active player to the next player at end of the turn", () => {
    testGame.nextTurn();
    expect(testGame.currentPlayer.name).toBe("test-player2");
  });
});
