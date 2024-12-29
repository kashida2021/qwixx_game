import QwixxLogic from "../../services/QwixxLogic";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Player from "../../models/PlayerClass";
import Dice from "../../models/DiceClass";
import { mockSixSidedDice } from "./__mocks__/QwixxLogicTestMocks";

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

    mockDice = new Dice(mockSixSidedDice);

    mockPlayersArray = [mockPlayer1, mockPlayer2];

    testGame = new QwixxLogic(mockPlayersArray, mockDice);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Game logic tests", () => {
    test("making a move before rolling dice throws an error", () => {
      const res = testGame.makeMove("test-player1", "red", 2);

      if (res.success) {
        throw new Error(
          "Making a move before rolling a dice shouldn't be successful."
        );
      }

      expect(res.success).toBeFalsy();
      expect(res.errorMessage).toBe("Dice hasn't been rolled yet.");
    });

    it("should make a move and return the correct result", () => {
      const result = testGame.rollDice();
      const whiteDiceSum = result.diceValues.white1 + result.diceValues.white2;

      const gameState = testGame.makeMove("test-player2", "red", whiteDiceSum);

      if (!gameState.success) {
        throw new Error("Making a move should be successful.");
      }

      if (gameState.gameEnd) {
        throw new Error("Game shouldn't have ended.");
      }

      expect(gameState.success && !gameState.gameEnd).toBeTruthy();
      expect(gameState.data.players).toHaveProperty("test-player1");
      expect(gameState.data.players).toHaveProperty("test-player2");
      expect(gameState.data.players["test-player1"].gameCard).toHaveProperty(
        "penalties",
        []
      );
      expect(gameState.data.players["test-player2"].gameCard).toHaveProperty(
        "penalties",
        []
      );

      expect(gameState.data.dice).toMatchObject({
        white1: expect.any(Number),
        white2: expect.any(Number),
        red: expect.any(Number),
        yellow: expect.any(Number),
        green: expect.any(Number),
        blue: expect.any(Number),
      });
    });

    test("when all players have submitted a move, it should go to the next turn by making the next player the active player", () => {
      const res = testGame.rollDice();
      const initialGameState = testGame.serialize();
      expect(initialGameState.activePlayer).toBe("test-player1");

      const firstMoveState = testGame.makeMove("test-player1", "red", 5);
      if (!firstMoveState.success || firstMoveState.gameEnd) {
        throw new Error();
      }

      expect(firstMoveState.success).toBeTruthy();
      expect(firstMoveState.data.activePlayer).toBe("test-player1");

      const secondMoveState = testGame.makeMove("test-player1", "red", 7);
      if (!secondMoveState.success || secondMoveState.gameEnd) {
        throw new Error();
      }
      expect(secondMoveState.success).toBeTruthy();
      expect(secondMoveState.data.activePlayer).toBe("test-player1");

      const finalMoveState = testGame.makeMove("test-player2", "blue", 5);
      if (!finalMoveState.success || finalMoveState.gameEnd) {
        throw new Error();
      }
      expect(finalMoveState).toBeTruthy();
      expect(finalMoveState.data.activePlayer).toBe("test-player2");
    });

    test("when the game goes to the next turn, all players' submission state is reset", () => {
      testGame.rollDice();

      testGame.makeMove("test-player1", "red", 5);
      testGame.makeMove("test-player2", "blue", 5);

      expect(mockPlayer1.submissionCount).toBe(1);
      expect(mockPlayer2.submissionCount).toBe(1);
      expect(mockPlayer2.hasSubmittedChoice).toBeTruthy();

      testGame.makeMove("test-player1", "red", 7);

      expect(mockPlayer1.hasSubmittedChoice).toBeFalsy();
      expect(mockPlayer1.submissionCount).toBe(0);
      expect(mockPlayer2.hasSubmittedChoice).toBeFalsy();
      expect(mockPlayer2.submissionCount).toBe(0);
    });

    it("should throw an error if the player isn't found when making a move", () => {
      testGame.rollDice();
      expect(() => {
        testGame.makeMove("test-player3", "red", 2);
      }).toThrow("Player not found");
    });

    it("should throw an error if colour doesn't exist in rowColour enum", () => {
      testGame.rollDice();
      expect(() => {
        testGame.makeMove("test-player1", "orange", 1);
      }).toThrow("Invalid colour");
    });

    it("should roll all dice and return a value", () => {
      const result = testGame.rollDice();
      Object.values(result.diceValues).forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(6);
      });
    });

    it("should roll all dice and return whether active player has available moves", () => {
      const result = testGame.rollDice();
      expect(result.hasAvailableMoves).toBeTruthy();
    });

    it("should roll all the dice and return the value of hasRolled as true", () => {
      const result = testGame.rollDice();
      expect(result.hasRolled).toBeTruthy();
    });

    //TODO: UNIT TEST when rolling a dice returns the active player not having available moves.
  });

  describe("active player tests", () => {
    test("current player can submit up to 2 moves", () => {
      testGame.rollDice();
      testGame.makeMove("test-player1", "red", 5);
      expect(mockPlayer1.submissionCount).toBe(1);

      testGame.makeMove("test-player1", "red", 7);
      expect(mockPlayer1.submissionCount).toBe(2);
    });

    test("current player can't submit more than 2 moves", () => {
      testGame.rollDice();
      testGame.makeMove("test-player1", "red", 5);
      testGame.makeMove("test-player1", "red", 7);
      const result = testGame.makeMove("test-player1", "yellow", 7);
      if (result.success) {
        throw new Error("Can't submit more than 2 actions.");
      }
      expect(result.success).toBeFalsy();
      expect(result.errorMessage).toBe("Player already finished their turn.");
    });

    test("current player's hasSubmittedChoice is updated after submitting 2 moves", () => {
      testGame.rollDice();

      testGame.makeMove("test-player1", "red", 5);
      expect(mockPlayer1.hasSubmittedChoice).toBe(false);

      testGame.makeMove("test-player1", "red", 7);
      expect(mockPlayer1.hasSubmittedChoice).toBe(true);
    });

    test("active player marking a number that doesn't equal the sum of white dice should throw an error", () => {
      jest.spyOn(mockDice, "diceValues", "get").mockReturnValueOnce({
        white1: 5,
        white2: 5,
        red: 5,
        yellow: 5,
        green: 5,
        blue: 5,
      });

      testGame.rollDice();

      const result = testGame.makeMove("test-player1", "red", 9);
      if (result.success) {
        throw new Error("Marking an invalid number should be unsuccessful.");
      }
      expect(result.success).toBeFalsy();
      expect(result.errorMessage).toBe(
        "Number selected doesn't equal to sum of white dice."
      );
    });

    test.each([
      ["red", 9],
      ["yellow", 9],
      ["green", 9],
      ["blue", 9],
    ])(
      "active-player marking a number that doesn't equal the sum of a white dice and a %s dice should throw an error",
      (row, num) => {
        jest.spyOn(mockPlayer1, "submissionCount", "get").mockReturnValue(1);

        jest.spyOn(mockDice, "validColouredNumbers", "get").mockReturnValue({
          red: [3, 7],
          yellow: [4, 8],
          green: [5, 7],
          blue: [6, 2],
        });

        testGame.rollDice();

        const result = testGame.makeMove("test-player1", row, num);
        if (result.success) {
          throw new Error("Marking an invalid number should be unsuccessful.");
        }
        expect(result.success).toBeFalsy();
        expect(result.errorMessage).toBe(
          "Number selected doesn't equal to sum of white die and coloured die."
        );
      }
    );

    test("active-player can mark a number that equals the sum of the white dice", () => {
      testGame.rollDice();
      const res = testGame.makeMove("test-player1", "red", 5);

      if (!res.success) {
        throw new Error();
      }

      if (res.gameEnd) {
        throw new Error();
      }

      expect(res.success).toBeTruthy();
      expect(res.data.players["test-player1"].hasSubmittedChoice).toBeFalsy();
      expect(res.data.players["test-player1"].gameCard.rows.red).toEqual([5]);
    });

    //TODO: Maybe can use .each() here
    // Check this test is working
    test("active-player can mark a number that equals the sum of a white and a coloured die", () => {
      const diceResults = testGame.rollDice();
      const firstNumber =
        diceResults.diceValues.white1 + diceResults.diceValues.white2;
      testGame.makeMove("test-player1", "blue", firstNumber);

      const secondNumber =
        diceResults.diceValues.white1 + diceResults.diceValues.red;

      const validNumbers = mockDice.validColouredNumbers;

      expect(validNumbers["red"]?.includes(secondNumber)).toBeTruthy;

      expect(() =>
        testGame.makeMove("test-player1", "red", secondNumber)
      ).not.toThrow(
        "Number selected doesn't equal to sum of white die and coloured die."
      );
    });

    test("current player can end their turn without submitting a move", () => {
      testGame.rollDice();
      testGame.endTurn("test-player1");
      expect(mockPlayer1.hasSubmittedChoice).toBeTruthy();
    });
  });

  describe("non-active player tests", () => {
    test("non-current player can submit up to 1 move", () => {
      testGame.rollDice();
      testGame.makeMove("test-player2", "red", 5);
      expect(mockPlayer2.submissionCount).toBe(1);
    });

    test("non-current player can't submit more than 1 moves", () => {
      testGame.rollDice();
      testGame.makeMove("test-player2", "red", 5);

      const result = testGame.makeMove("test-player2", "red", 7);
      expect(result.success).toBeFalsy();
      if (!result.success) {
        expect(result.errorMessage).toBe("Player already finished their turn.");
      }
    });

    test("non-current player's hasSubmittedChoice is updated after submitting 1 move", () => {
      testGame.rollDice();

      testGame.makeMove("test-player2", "red", 5);
      expect(mockPlayer2.hasSubmittedChoice).toBe(true);
    });

    test("non-current player can end their turn without submitting a move", () => {
      testGame.rollDice();
      testGame.endTurn("test-player2");
      expect(mockPlayer2.hasSubmittedChoice).toBeTruthy();
    });

    test("non-active player can mark a number equal to the sum of the white dice", () => {
      testGame.rollDice();
      const res = testGame.makeMove("test-player2", "red", 5);

      if (!res.success) {
        throw new Error(
          "Marking a number equal to sum of white dice should be sucessful."
        );
      }

      if (res.gameEnd) {
        throw new Error("Game shouldn't have ended.");
      }

      expect(res.success).toBeTruthy();
      expect(res.data.players["test-player2"].hasSubmittedChoice).toBeTruthy();
    });

    test("non-active player marking a number that doesn't equal to the sum of the white dice should return an error", () => {
      testGame.rollDice();
      const res = testGame.makeMove("test-player2", "red", 6);
      if (res.success) {
        throw new Error(
          "Marking a number that doesnt' equal sum of white dice should fail."
        );
      }

      expect(res.success).toBeFalsy();
      expect(res.errorMessage).toBe(
        "Number selected doesn't equal to sum of white dice."
      );
    });
  });

  describe("end turn tests", () => {
    test("active player can end their turn", () => {
      testGame.rollDice();
      const result = testGame.endTurn("test-player1");
      expect(result.success).toBeTruthy();
      if (result.success && !result.gameEnd) {
        const player1State = result.data.players["test-player1"];
        expect(player1State?.hasSubmittedChoice).toBeTruthy();
      }
    });

    test("non-active player can end their turn without penalty", () => {
      testGame.rollDice();
      const result = testGame.endTurn("test-player2");
      expect(result.success).toBeTruthy();
      if (result.success && !result.gameEnd) {
        const player2State = result.data.players["test-player2"];
        expect(player2State?.hasSubmittedChoice).toBeTruthy();
        expect(player2State?.gameCard.penalties).not.toEqual([1]);
      }
    });

    it("doesn't add a penalty to the active player when they marked a number and end their turn", () => {
      testGame.rollDice();
      const diceResult = testGame.rollDice();
      const whiteDiceSum =
        diceResult.diceValues.white1 + diceResult.diceValues.white2;
      testGame.makeMove("test-player1", "red", whiteDiceSum);

      const result = testGame.endTurn("test-player1");
      expect(result.success).toBeTruthy();
      if (result.success && !result.gameEnd) {
        const player1State = result.data.players["test-player1"];
        expect(player1State?.gameCard.penalties).not.toEqual([1]);
      }
    });

    it("adds a penalty to the active player if they end turn without marking a number", () => {
      testGame.rollDice();
      const result = testGame.endTurn("test-player1");
      expect(result.success).toBeTruthy();
      if (result.success && !result.gameEnd) {
        const player1State = result.data.players["test-player1"];
        expect(player1State?.gameCard.penalties).toEqual([1]);
      }
    });

    it("returns an error if player has already ended their turn", () => {
      testGame.rollDice();
      testGame.endTurn("test-player1");
      const result = testGame.endTurn("test-player1");
      expect(result.success).toBeFalsy();
      if (!result.success) {
        expect(result.errorMessage).toBe(
          "Player already finished their turn."
        );
      }
    });
  });

  test("Can't end a turn if a dice hasn't been rolled", () => {
    const res = testGame.endTurn("test-player1");

    if (res.success) {
      throw new Error();
    }
    expect(res.success).toBeFalsy();
    expect(res.errorMessage).toBe("Dice hasn't been rolled yet.");
  });

  test("should throw an error if player not found", () => {
    testGame.rollDice();
    expect(() => testGame.endTurn("player3")).toThrow("Player not found");
  });

  describe("Process Penalty test", () => {
    it("should add a penalty to the player and mark them as submitted", () => {
      testGame.rollDice();
      const res = testGame.processPenalty("test-player1");

      if (!res.success || res.gameEnd) {
        throw new Error();
      }
      expect(res.success).toBeTruthy();

      expect(res.data.players["test-player1"].gameCard.penalties).toEqual([1]);
      expect(res.data.players["test-player1"].hasSubmittedChoice).toBeTruthy();
    });

    test.todo("Can't add more than one penalty per round");

    it("should throw an error if player not found", () => {
      testGame.rollDice();
      expect(() => testGame.processPenalty("player3")).toThrow(
        "Player not found"
      );
    });
  });

  describe("Pass move tests", () => {
    test("Can't pass turn if a dice hasn't been rolled", () => {
      const res = testGame.passMove("test-player1");

      if (res.success) {
        throw new Error();
      }

      expect(res.success).toBeFalsy();
      expect(res.errorMessage).toBe("Dice hasn't been rolled yet.");
    });
  });

  test("should throw an error if player not found", () => {
    testGame.rollDice();
    expect(() => testGame.passMove("player3")).toThrow("Player not found.");
  });

  test.todo("Verify that only active player can pass move");
  test.todo("What's the expected behaviour when successful?");
});
