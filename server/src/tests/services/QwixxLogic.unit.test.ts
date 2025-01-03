import QwixxLogic from "../../services/QwixxLogic";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Dice from "../../models/DiceClass";
import { DiceColour } from "../../enums/DiceColours";
import SixSidedDie from "../../models/SixSidedDieClass";
import { rowColour } from "../../enums/rowColours";

const MockedGameCardClass = qwixxBaseGameCard as jest.Mocked<
  typeof qwixxBaseGameCard
>;
const gameCardMock1 = new MockedGameCardClass();
const gameCardMock2 = new MockedGameCardClass();

const player1Mock = new Player("player1", gameCardMock1) as jest.Mocked<Player>;
player1Mock.markNumber = jest.fn().mockReturnValue(true);

const player2Mock = new Player("player2", gameCardMock2) as jest.Mocked<Player>;
player2Mock.markNumber = jest.fn().mockReturnValue(true);

const MockedDie = SixSidedDie as jest.Mocked<typeof SixSidedDie>;
const MockedDiceClass = Dice as jest.Mocked<typeof Dice>;
const fakeDice = new MockedDiceClass(MockedDie);
jest.spyOn(fakeDice, "diceValues", "get").mockReturnValue({
  [DiceColour.White1]: 5,
  [DiceColour.White2]: 5,
  [DiceColour.Red]: 5,
  [DiceColour.Yellow]: 5,
  [DiceColour.Green]: 5,
  [DiceColour.Blue]: 5,
});
jest.spyOn(fakeDice, "validColouredNumbers", "get").mockReturnValue({
  [DiceColour.Red]: [10, 10],
  [DiceColour.Yellow]: [10, 10],
  [DiceColour.Green]: [10, 10],
  [DiceColour.Blue]: [10, 10],
});

jest.spyOn(fakeDice, "whiteDiceSum", "get").mockReturnValue(10);

// TODO: This might no longer be necessary
jest
  .spyOn(gameCardMock1, "getHighestMarkedNumber")
  .mockImplementation((row) => {
    if (row === "red") return 9;
    if (row === "yellow") return 8;
    if (row === "green") return 8;
    if (row === "blue") return 8;
    return 2;
  });

jest.spyOn(gameCardMock1, "getLowestMarkedNumber").mockImplementation((row) => {
  if (row === "red") return 2;
  if (row === "yellow") return 2;
  if (row === "green") return 5;
  if (row === "blue") return 4;
  return 12;
});

const playersArrayMock = [player1Mock, player2Mock];

describe("Qwixx Logic tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("markNumber method tests", () => {
    it("should call the markNumber method with correct args", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      testGame.rollDice();
      testGame.makeMove("player1", "red", 10);

      expect(player1Mock.markNumber).toHaveBeenCalledWith("red", 10);
      expect(player1Mock.markNumber).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the player isn't found", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      testGame.rollDice();

      expect(() => testGame.makeMove("bad-player", "red", 2)).toThrow(
        "Player not found"
      );
    });

    test("non-active player marking a number that doesn't equal the sum of white dice should return error object", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);

      testGame.rollDice();

      const res = testGame.makeMove("player2", "red", 9);
      if (!res.success) {
        expect(res.success).toBeFalsy();
        expect(res.error).toEqual(
          "Number selected doesn't equal to sum of white dice."
        );
      }
    });

    test("non-active player can mark a number equal to the sum of the white dice", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);

      testGame.rollDice();
      testGame.makeMove("player2", "red", 10);

      expect(player2Mock.markNumber).toHaveBeenCalledWith("red", 10);
      expect(player2Mock.markNumber).toHaveBeenCalledTimes(1);
    });

    test("active player marking a number that doesn't equal the sum of white dice should throw an error", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      testGame.rollDice();

      const res = testGame.makeMove("player1", "red", 9);
      if (!res.success) {
        expect(res.success).toBeFalsy();
        expect(res.error).toEqual(
          "Number selected doesn't equal to sum of white dice."
        );
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
        jest.spyOn(player1Mock, "submissionCount", "get").mockReturnValue(1);
        const testGame = new QwixxLogic(playersArrayMock, fakeDice);

        testGame.rollDice();

        const res = testGame.makeMove("player1", row, num);
        if (!res.success) {
          expect(res.success).toBeFalsy();
          expect(res.error).toEqual(
            "Number selected doesn't equal to sum of white die and coloured die."
          );
        }
      }
    );

    test.each([
      ["red", 10],
      ["yellow", 10],
      ["green", 10],
      ["blue", 10],
    ])(
      "active-player marking a number that equals the sum of a white dice and a %s dice shouldn't throw an error",
      (row, num) => {
        jest.spyOn(player1Mock, "submissionCount", "get").mockReturnValue(1);
        const testGame = new QwixxLogic(playersArrayMock, fakeDice);

        testGame.rollDice();

        expect(() => {
          testGame.makeMove("player1", row, num);
        }).not.toThrow(
          "Number selected doesn't equal to sum of white die and coloured die."
        );
      }
    );
  });

  describe("rollDice method tests", () => {
    test("moveAvailability should return true if gameCard is empty", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      const res = testGame.rollDice();

      jest.spyOn(gameCardMock1, "hasAvailableMoves").mockReturnValueOnce(true);
      expect(res.hasAvailableMoves).toBeTruthy();
    });
  });

  describe("processPenalthy method tests", () => {
    it("should add a penalty to the player and mark them as submitted", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      const player1AddPenaltySpy = jest.spyOn(gameCardMock1, "addPenalty");
      const player1MarkSubmittedSpy = jest.spyOn(player1Mock, "markSubmitted");

      testGame.processPenalty("player1");

      expect(player1AddPenaltySpy).toHaveBeenCalled();
      expect(player1MarkSubmittedSpy).toHaveBeenCalled();
    });

    it("should throw an error if player not found", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      expect(() => testGame.processPenalty("player3")).toThrow(
        "Player not found"
      );
    });

    it("should add a penalty to the players gamecard", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);

      const addPenaltySpy = jest.spyOn(player1Mock.gameCard, "addPenalty");
      testGame.processPenalty("player1");

      expect(addPenaltySpy).toHaveBeenCalled();
    });
  });

  describe("endTurn method tests", () => {
    test("Can't end a turn if a dice hasn't been rolled", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      const res = testGame.endTurn("player1");

      expect(res.success).toBeFalsy();
      expect(res.errorMessage).toBe("Dice hasn't been rolled yet.");
    });

    test("should throw an error if player not found", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      testGame.rollDice();
      expect(() => testGame.endTurn("player3")).toThrow("Player not found.");
    });
  });

  describe("passMove method tests", () => {
    test("Can't pass turn if a dice hasn't been rolled", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      const res = testGame.passMove("player1");

      expect(res.isValid).toBeFalsy();

      if (!res.isValid) {
        expect(res.errorMessage).toBe("Dice hasn't been rolled yet.");
      }
    });

    test("should throw an error if player not found", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      testGame.rollDice();
      expect(() => testGame.passMove("player3")).toThrow("Player not found.");
    });

    test("passMove method should be called if valid", () => {
      const testGame = new QwixxLogic(playersArrayMock, fakeDice);
      console.log("submission count before:", player1Mock.submissionCount);

      jest.spyOn(player1Mock, "submissionCount", "get").mockReturnValue(0);

      if (player1Mock) {
        jest.spyOn(player1Mock, "passMove");
      }

      testGame.rollDice();
      console.log(
        "expect submission count to be 0",
        player1Mock.submissionCount
      );
      const res = testGame.passMove("player1");
      console.log(
        "submission count should be increased after passMove",
        player1Mock.submissionCount
      );
      expect(player1Mock.passMove).toHaveBeenCalled();
      expect(res.isValid).toBeTruthy();
    });
  });

  // TODO: This should be combined with the game end phase test.
  describe("Calculate all players' score", () => {
    it("Can get back all players' score", () => {
      gameCardMock1.calculateScore = jest.fn().mockReturnValueOnce(73)
      gameCardMock2.calculateScore = jest.fn().mockReturnValueOnce(68)

      const expected = {
        player1: 73,
        player2: 68,
      }

      const testGame = new QwixxLogic(playersArrayMock, fakeDice)
      const res = testGame.calculateScores()

      expect(res).toEqual(expected)
    })

    it("Can determine the winner", () => {
      gameCardMock1.calculateScore = jest.fn().mockReturnValueOnce(73)
      gameCardMock2.calculateScore = jest.fn().mockReturnValueOnce(68)

      const testGame = new QwixxLogic(playersArrayMock, fakeDice)
      const res = testGame.determineWinner()

      expect(res).toEqual(["player1"])
    })

    it("Can determine multiple winners", () => {
      gameCardMock1.calculateScore = jest.fn().mockReturnValueOnce(73)
      gameCardMock2.calculateScore = jest.fn().mockReturnValueOnce(73)

      const testGame = new QwixxLogic(playersArrayMock, fakeDice)
      const res = testGame.determineWinner()

      expect(res).toEqual(["player1", "player2"])
    })
  })
});
