import QwixxLogic from "../../services/QwixxLogic";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Player from "../../models/PlayerClass";
import SixSidedDie from "../../models/SixSidedDieClass";
import Dice from "../../models/DiceClass";

let mockPlayersArray: Player[];
let mockDice: Dice;
let testGame: QwixxLogic;
let mockPlayer1: Player;
let mockPlayer2: Player;

describe("Qwixx Logic integration tests:", () => {
  beforeEach(() => {
    const mockgameCard1 = new qwixxBaseGameCard();
    mockPlayer1 = new Player("test-player1", mockgameCard1);

    const mockgameCard2 = new qwixxBaseGameCard();
    mockPlayer2 = new Player("test-player2", mockgameCard2);

    mockDice = new Dice(SixSidedDie);

    mockPlayersArray = [mockPlayer1, mockPlayer2];

    testGame = new QwixxLogic(mockPlayersArray, mockDice);
  });

  test("making a move before rolling dice throws an error", () => {
    expect(() => testGame.makeMove("test-player1", "red", 2)).toThrow(
      "Dice hasn't been rolled yet."
    );
  });

  it("should make a move and return the correct result", () => {
    testGame.rollDice();
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

  test("current player can submit up to 2 moves", () => {
    testGame.rollDice();
    testGame.makeMove("test-player1", "red", 2);
    expect(mockPlayer1.submissionCount).toBe(1);

    testGame.makeMove("test-player1", "red", 3);
    expect(mockPlayer1.submissionCount).toBe(2);
  });

  test("current player can't submit more than 2 moves", () => {
    testGame.rollDice();
    testGame.makeMove("test-player1", "red", 2);
    testGame.makeMove("test-player1", "red", 3);

    expect(() => {
      testGame.makeMove("test-player1", "red", 4);
    }).toThrow("Player already finished their turn");
  });

  test("current player's hasSubmittedChoice is updated after submitting 2 moves", () => {
    testGame.rollDice();

    testGame.makeMove("test-player1", "red", 1);
    expect(mockPlayer1.hasSubmittedChoice).toBe(false);

    testGame.makeMove("test-player1", "red", 2);
    expect(mockPlayer1.hasSubmittedChoice).toBe(true);
  });

  test("non-current player can submit up to 1 move", () => {
    testGame.rollDice();
    testGame.makeMove("test-player2", "red", 2);
    expect(mockPlayer2.submissionCount).toBe(1);
  });

  test("non-current player can't submit more than 1 moves", () => {
    testGame.rollDice();
    testGame.makeMove("test-player2", "red", 2);

    expect(() => {
      testGame.makeMove("test-player2", "red", 3);
    }).toThrow("Player already finished their turn");
  });

  test("non-current player's hasSubmittedChoice is updated after submitting 1 move", () => {
    testGame.rollDice();

    testGame.makeMove("test-player2", "red", 1);
    expect(mockPlayer2.hasSubmittedChoice).toBe(true);
  });

  test("when all players have submitted a move, it should go to the next turn by making the next player the current player", () => {
    testGame.rollDice();
    const initialGameState = testGame.serialize();

    expect(initialGameState.activePlayer).toBe("test-player1");

    const firstMoveState = testGame.makeMove("test-player1", "red", 1);
    expect(firstMoveState.activePlayer).toBe("test-player1");

    const secondMoveState = testGame.makeMove("test-player1", "red", 2);
    expect(secondMoveState.activePlayer).toBe("test-player1");

    const finalMoveState = testGame.makeMove("test-player2", "blue", 3);
    expect(finalMoveState.activePlayer).toBe("test-player2");
  });

  it("should throw an error if the player isn't found when making a move", () => {
    testGame.rollDice();
    expect(() => {
      testGame.makeMove("test-player3", "red", 1);
    }).toThrow("Player not found");
  });

  it("should throw an error if colour doesn't exist in rowColour enum", () => {
    testGame.rollDice();
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

  test("non-current player can end their turn without submitting a move", () => {
    testGame.rollDice();
    testGame.endTurn("test-player2");
    expect(mockPlayer2.hasSubmittedChoice).toBeTruthy(); 
  })

  test("current player can end their turn without submitting a move", () => {
    testGame.rollDice();
    testGame.endTurn("test-player1");
    expect(mockPlayer1.hasSubmittedChoice).toBeTruthy();
  })
});
