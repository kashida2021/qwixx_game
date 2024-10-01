import QwixxLogic from "../../services/QwixxLogic";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Dice from "../../models/DiceClass";
import { DiceColour } from "../../enums/DiceColours";
import SixSidedDie from "../../models/SixSidedDieClass";

/**
 * @description
 * Using Partial<T> utility method to mock classes
 */

const player1Mock: Partial<Player> = {
  name: "player1",
  get submissionCount() {
    return 0;
  },
  hasSubmittedChoice: false,
  serialize: jest.fn(),
  markSubmitted: jest.fn(),
  markNumber: jest.fn(),
};

const player2Mock: Partial<Player> = {
  name: "player2",
  hasSubmittedChoice: false,
  serialize: jest.fn(),
  markSubmitted: jest.fn(),
  markNumber: jest.fn(),
};

const diceMock: Partial<Dice> = {
  diceValues: {
    [DiceColour.White1]: 5,
    [DiceColour.White2]: 5,
    [DiceColour.Red]: 5,
    [DiceColour.Yellow]: 5,
    [DiceColour.Green]: 5,
    [DiceColour.Blue]: 5,
  },
  rollAllDice: jest.fn(),
  serialize: jest.fn(),
  get validColouredNumbers() {
    return {
      [DiceColour.Red]: [10, 10],
      [DiceColour.Yellow]: [10, 10],
      [DiceColour.Green]: [10, 10],
      [DiceColour.Blue]: [10, 10],
    };
  },
};

const playersArrayMock: Player[] = [
  player1Mock as Player,
  player2Mock as Player,
];

describe("Qwixx Logic tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

  it("should call the markNumber method with correct args", () => {
    (player1Mock.markNumber as jest.Mock).mockReturnValue(true);

    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);
    testGame.rollDice();
    testGame.makeMove("player1", "red", 10);

    expect(player1Mock.markNumber).toHaveBeenCalledWith("red", 10);
    expect(player1Mock.markNumber).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the player isn't found", () => {
    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);

    testGame.rollDice();

    expect(() => testGame.makeMove("bad-player", "red", 2)).toThrow(
      "Player not found"
    );
  });

  test("non-active player marking a number that doesn't equal the sum of white dice should throw an error", () => {
    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);

    testGame.rollDice();

    expect(() => {
      testGame.makeMove("player2", "red", 9);
    }).toThrow("Number selected doesn't equal to sum of white dice.");
  });

  test("non-active player can mark a number equal to the sum of the white dice", () => {
    (player2Mock.markNumber as jest.Mock).mockReturnValue(true);
    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);

    testGame.rollDice();
    testGame.makeMove("player2", "red", 10);

    expect(player2Mock.markNumber).toHaveBeenCalledWith("red", 10);
    expect(player2Mock.markNumber).toHaveBeenCalledTimes(1);
  });

  test("active player marking a number that doesn't equal the sum of white dice should throw an error", () => {
    (player1Mock.markNumber as jest.Mock).mockReturnValue(true);
    // jest
    //   .spyOn(Player.prototype, "submissionCount", "get")
    //   .mockReturnValue(1);

    jest.spyOn(player1Mock, "submissionCount", "get").mockReturnValueOnce(0);

    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);
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
      const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);
      jest.spyOn(player1Mock, "submissionCount", "get").mockReturnValue(1);
    //   (player1Mock.markNumber as jest.Mock).mockReturnValue(true);

      testGame.rollDice();

      expect(() => {
        testGame.makeMove("player1", row, num);
      }).toThrow(
        "Number selected doesn't equal to sum of white die and coloured die."
      );
    }
  );
});
