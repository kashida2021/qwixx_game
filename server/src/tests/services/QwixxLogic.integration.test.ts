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

jest.mock("../../models/SixSidedDieClass");

const SixSidedDieMock = SixSidedDie as jest.MockedClass<typeof SixSidedDie>;

// Set up the behavior of all `rollDie()` calls
describe("Qwixx Logic integration tests:", () => {
  beforeEach(() => {
    SixSidedDieMock.prototype.rollDie
      .mockImplementationOnce(() => 2)
      .mockImplementationOnce(() => 3)
      .mockImplementationOnce(() => 4)
      .mockImplementationOnce(() => 5)
      .mockImplementationOnce(() => 6)
      .mockImplementationOnce(() => 1);

    const mockgameCard1 = new qwixxBaseGameCard();
    mockPlayer1 = new Player("test-player1", mockgameCard1);

    const mockgameCard2 = new qwixxBaseGameCard();
    mockPlayer2 = new Player("test-player2", mockgameCard2);

    mockDice = new Dice(SixSidedDieMock);

    mockPlayersArray = [mockPlayer1, mockPlayer2];

    testGame = new QwixxLogic(mockPlayersArray, mockDice);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Game logic tests", () => {
    test("making a move before rolling dice throws an error", () => {
      const res = testGame.makeMove("test-player1", "red", 2)

      expect(res.success).toBeFalsy()
      if (!res.success) {
        expect(res.error).toBe("Dice hasn't been rolled yet.")
      }
    });

    it("should make a move and return the correct result", () => {
      const result = testGame.rollDice();
      const whiteDiceSum = result.diceValues.white1 + result.diceValues.white2;

      const gameState = testGame.makeMove("test-player2", "red", whiteDiceSum);

      if (gameState.success) {
        expect(gameState.data.players).toHaveProperty("test-player1")
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
      }
    });

    test("when all players have submitted a move, it should go to the next turn by making the next player the active player", () => {
      const result = testGame.rollDice();
      const initialGameState = testGame.serialize();
      console.log(result);
      expect(initialGameState.activePlayer).toBe("test-player1");

      //  const firstMoveState = testGame.makeMove("test-player1", "red", 5);
      //  expect(firstMoveState.activePlayer).toBe("test-player1");

      //  const secondMoveState = testGame.makeMove("test-player1", "red", 7);
      //  expect(secondMoveState.activePlayer).toBe("test-player1");

      //  const finalMoveState = testGame.makeMove("test-player2", "blue", 5);
      //  expect(finalMoveState.activePlayer).toBe("test-player2");
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
      expect(result.hasAvailableMoves).toBeTruthy()
    })

    it("should roll all the dice and return the value of hasRolled as true", () => {
      const result = testGame.rollDice();
      expect(result.hasRolled).toBeTruthy()
    })
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
      const result = testGame.makeMove("test-player1", "yellow", 7)
      expect(result.success).toBeFalsy()
      if (!result.success) {
        expect(result.error)
      }
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

      const result = testGame.makeMove("test-player1", "red", 9)
      expect(result.success).toBeFalsy()
      if (!result.success) {
        expect(result.error).toBe("Number selected doesn't equal to sum of white dice.")
      }
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

        jest
          .spyOn(mockDice, "validColouredNumbers", "get")
          // .mockReturnValue([3, 4, 5, 6, 7, 8, 7, 2])
          .mockReturnValue({
            red: [3, 7],
            yellow: [4, 8],
            green: [5, 7],
            blue: [6, 2],
          });

        testGame.rollDice();

        const result = testGame.makeMove("test-player1", row, num);
        expect(result.success).toBeFalsy()
        if (!result.success) {
          expect(result.error).toBe("Number selected doesn't equal to sum of white die and coloured die.")
        }
      }
    );

    test("active-player can mark a number that equals the sum of a white and a coloured die", () => {
      const diceResults = testGame.rollDice();
      const firstNumber = diceResults.diceValues.white1 + diceResults.diceValues.white2;
      testGame.makeMove("test-player1", "blue", firstNumber);

      const secondNumber = diceResults.diceValues.white1 + diceResults.diceValues.red;

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
      expect(result.success).toBeFalsy()
      if (!result.success) {
        expect(result.error).toBe("Player already finished their turn.")
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
  });

  describe("end turn tests", () => {
    test("active player can end their turn", () => {
      testGame.rollDice()
      const result = testGame.endTurn("test-player1")
      expect(result.success).toBeTruthy()
      if (result.success) {
        const player1State = result.data?.players["test-player1"]
        expect(player1State?.hasSubmittedChoice).toBeTruthy()
      }
    })

    it("doesn't add a penalty to the active player when they marked a number and end their turn", () => {
      testGame.rollDice()
      const diceResult = testGame.rollDice();
      const whiteDiceSum = diceResult.diceValues.white1 + diceResult.diceValues.white2;
      testGame.makeMove("test-player1", "red", whiteDiceSum);

      const result = testGame.endTurn("test-player1")
      expect(result.success).toBeTruthy()
      if (result.success) {
        const player1State = result.data?.players["test-player1"]
        expect(player1State?.gameCard.penalties).not.toEqual([1,])
      }
    })

    it("adds a penalty to the active player if they end turn without marking a number", () => {
      testGame.rollDice()
      const result = testGame.endTurn("test-player1")
      expect(result.success).toBeTruthy()
      if (result.success) {
        const player1State = result.data?.players["test-player1"]
        expect(player1State?.gameCard.penalties).toEqual([1,])
      }
    })

    it("returns an error if player has already end their turn", () => {
      testGame.rollDice()
      testGame.endTurn("test-player1")
      const result = testGame.endTurn("test-player1")
      expect(result.success).toBeFalsy()
      if (!result.success) {
        expect(result.errorMessage).toBe("Player has already ended their turn.")
      }
    })
  })
});
