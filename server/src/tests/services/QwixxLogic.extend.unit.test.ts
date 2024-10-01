import QwixxLogic from "../../services/QwixxLogic";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Dice from "../../models/DiceClass";
import { DiceColour } from "../../enums/DiceColours";
import SixSidedDie from "../../models/SixSidedDieClass";

/**
 * @description
 * Using inheritance to create mock
 */
class qwixxBaseGameCardMock extends qwixxBaseGameCard {
  markNumbers = jest.fn();
}
class playerMock extends Player {
  markNumber = jest.fn();
}

class diceMock extends Dice {
  get diceValues(): Record<DiceColour, number> {
    return {
      white1: 5,
      white2: 5,
      red: 5,
      yellow: 5,
      green: 5,
      blue: 5,
    };
  }
  rollAllDice = jest.fn();
  serialize = jest.fn();
}

class SixSidedDieMock extends SixSidedDie {}

const fakeDice = new diceMock(SixSidedDieMock);
const gameCardMock1 = new qwixxBaseGameCardMock();
const gameCardMock2 = new qwixxBaseGameCardMock();
const player1Mock = new playerMock("player1", gameCardMock1);
const player2Mock = new playerMock("player2", gameCardMock2);
const playersArrayMock = [player1Mock, player2Mock];

describe("Qwixx Logic tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call the markNumber method with correct args", () => {
    player1Mock.markNumber.mockReturnValue(true);
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
    player2Mock.markNumber.mockReturnValue(true);
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
});
