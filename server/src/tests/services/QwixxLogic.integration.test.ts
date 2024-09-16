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

  // it.skip("should return all players", () => {
  //   expect(testGame.players.length).toBe(2);
  //   testGame.players.forEach((player) => {
  //     expect(player.gameCard instanceof qwixxBaseGameCard).toBe(true);
  //   });
  // });

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

  // it.skip("should updated hasSubmitted when a player makes a move", () => {
  //   testGame.makeMove("test-player1", "red", 1);
  //   expect(testGame.players[0].hasSubmittedChoice).toBe(true);
  // });

  test("when all players have submitted a move, it should go to the next turn by making the next player the current player", () => {
    const initialGameState = testGame.serialize();

    expect(initialGameState.activePlayer).toBe('test-player1');

    const firstMoveState = testGame.makeMove("test-player1", "red", 1);
    expect(firstMoveState.activePlayer).toBe("test-player1");

    const finalMoveState = testGame.makeMove("test-player2", "blue", 3);
    expect(finalMoveState.activePlayer).toBe("test-player2");
  })
  //Maybe should break this test down into smaller parts.
  // it.skip("should reset players submission and go to the next turn when every player has made a move", () => {
  //   const resetSpy = jest.spyOn(testGame, "resetAllPlayersSubmission");
  //   const nextTurnSpy = jest.spyOn(testGame, "nextTurn");

  //   expect(testGame.currentPlayer).toBe(mockPlayer1);

  //   testGame.makeMove("test-player1", "red", 1);
  
  //   expect(resetSpy).not.toHaveBeenCalled();
  //   expect(nextTurnSpy).not.toHaveBeenCalled();

  //   const gameState = testGame.makeMove("test-player2", "blue", 3);
   
  //   expect(resetSpy).toHaveBeenCalled();
  //   expect(nextTurnSpy).toHaveBeenCalled();

  //   expect(testGame.hasRolled).toBe(false);
  //   expect(testGame.currentPlayer).toBe(mockPlayer2);
  //   });

  it("should throw an error if the player isn't found when making a move", () => {
    expect(() => {
      testGame.makeMove("test-player3", "red", 1);
    }).toThrow("Player not found");
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

  //hasRolled() should potentially be a private method.
  // it.skip("should update the hasRolled property to true once a dice has been rolled", () => {
  //   testGame.rollDice();
  //   expect(testGame.hasRolled).toBe(true);
  // });

  //currentPlayer should potentially be a private method.
  // it.skip("should have an active player, which is the first player players array", () => {
  //   expect(testGame.currentPlayer.name).toBe("test-player1");
  // });

  //nextTurn() should be a private method
  // it.skip("should change active player to the next player at end of the turn", () => {
  //   testGame.nextTurn();
  //   expect(testGame.currentPlayer.name).toBe("test-player2");
  // });
});
