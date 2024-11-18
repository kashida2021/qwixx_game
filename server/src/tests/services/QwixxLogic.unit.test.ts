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

  test("non-active player marking a number that doesn't equal the sum of white dice should throw an error", () => {
    const testGame = new QwixxLogic(playersArrayMock, fakeDice);

    testGame.rollDice();

    expect(() => {
      testGame.makeMove("player2", "red", 9);
    }).toThrow("Number selected doesn't equal to sum of white dice.");
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

    expect(() => {
      testGame.makeMove("player1", "red", 9);
    }).toThrow("Number selected doesn't equal to sum of white dice.");
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

      expect(() => {
        testGame.makeMove("player1", row, num);
      }).toThrow(
        "Number selected doesn't equal to sum of white die and coloured die."
      );
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

  test.only("moveAvailability should return true if gameCard is empty", () => {
    const testGame = new QwixxLogic(playersArrayMock, fakeDice);
    const res = testGame.rollDice();

    expect(res.hasAvailableMoves).toBeTruthy();
  });

  test("active-player marking a number that equals the sum of a white dice but lower than highest marked red row will throw an error", () => {
    const originalImplementation = gameCardMock1.getHighestMarkedNumber;

    jest
      .spyOn(gameCardMock1, "getHighestMarkedNumber")
      .mockImplementation((row) => {
        if (row === "red") return 11;
        if (row === "yellow") return 8;
        if (row === "green") return 8;
        if (row === "blue") return 8;
        return 2;
      });

    const testGame = new QwixxLogic(playersArrayMock, fakeDice);
    testGame.rollDice();

    expect(() => {
      testGame.makeMove("player1", "red", 10);
    }).toThrow("Number must be above the last marked number");

    jest
      .spyOn(gameCardMock1, "getHighestMarkedNumber")
      .mockImplementation(originalImplementation);
  });

  test("should throw error when trying to mark blue 10, if gamecard has no valid moves", () => {
    jest
      .spyOn(gameCardMock1, "getHighestMarkedNumber")
      .mockImplementation((row) => {
        if (row === "red" || row === "yellow") return 11;
        return 10;
      });

    jest
      .spyOn(gameCardMock1, "getLowestMarkedNumber")
      .mockImplementation((row) => {
        if (row === "green" || row === "blue") return 6;
        return 4;
      });

    const testGame = new QwixxLogic(playersArrayMock, fakeDice);
    testGame.rollDice();
    //const isMoveAvailable = testGame.validMoveAvailable();

    expect(() => {
      testGame.makeMove("player1", "blue", 10);
    }).toThrow("Number must be below the last marked number");

    //expect(isMoveAvailable["player1"]).toBe(false);
    //expect(isMoveAvailable["player2"]).toBe(true);
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

      // TODO: explain why this test isn't applicable in this unit test

      //      const serializedData = {
      //        gamecard: {
      //          rows: {
      //            red: [],
      //            yellow: [],
      //            green: [],
      //            blue: [],
      //          },
      //          isLocked: {
      //            red: false,
      //            yellow: false,
      //            green: false,
      //            blue: false,
      //          },
      //          penalties: [1],
      //        },
      //        hasSubmittedChoice: false,
      //      };

      // jest.spyOn(player1Mock, "serialize").mockReturnValue(serializedData);

      const addPenaltySpy = jest.spyOn(player1Mock.gameCard, "addPenalty");
      testGame.processPenalty("player1");

      expect(addPenaltySpy).toHaveBeenCalled();
      //expect(player1Mock.serialize()).toEqual(serializedData);
    });
  });
});
