```TypeScript
import QwixxLogic from "../../services/QwixxLogic";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Dice from "../../models/DiceClass";
import { DiceColour } from "../../enums/DiceColours";
import SixSidedDie from "../../models/SixSidedDieClass";

jest.mock("../../models/PlayerClass");
jest.mock("../../models/DiceClass");
jest.mock("../../models/QwixxBaseGameCard");
jest.mock("../../models/SixSidedDieClass");

const GameCardMock = qwixxBaseGameCard as jest.MockedClass<
  typeof qwixxBaseGameCard
>;
const gameCardMock1 = new GameCardMock();
const gameCardMock2 = new GameCardMock();

const MockedPlayerClass = Player as jest.MockedClass<typeof Player>;
MockedPlayerClass.mockImplementation(function (
  this: any,
  name: string,
  gameCard: any
) {
  this.name = name;
  this.gameCard = gameCard;
  this.markNumber = jest.fn().mockReturnValue(true); 
  // Set up a private variable to track submission count dynamically
  let _submissionCount = 0;

  // Use `Object.defineProperty` to set up the `submissionCount` getter
  Object.defineProperty(this, "submissionCount", {
    get: jest.fn(() => _submissionCount),
    configurable: true,
  });

  return this;
});

const player1Mock = new MockedPlayerClass("player1", gameCardMock1);
const player2Mock = new MockedPlayerClass("player2", gameCardMock2);

const MockedDie = SixSidedDie as jest.MockedClass<typeof SixSidedDie>;
const MockedDiceClass = Dice as jest.MockedClass<typeof Dice>;
MockedDiceClass.mockImplementation(function (
  this: any,
  DieClass: typeof SixSidedDie
) {
  // Create dice instances from the mocked SixSidedDie class
  this._dice = {
    [DiceColour.White1]: new DieClass(),
    [DiceColour.White2]: new DieClass(),
    [DiceColour.Red]: new DieClass(),
    [DiceColour.Yellow]: new DieClass(),
    [DiceColour.Green]: new DieClass(),
    [DiceColour.Blue]: new DieClass(),
  };

  // Manually set the expected mock values for `diceValues`
  this.diceValues = {
    [DiceColour.White1]: 5,
    [DiceColour.White2]: 5,
    [DiceColour.Red]: 5,
    [DiceColour.Yellow]: 5,
    [DiceColour.Green]: 5,
    [DiceColour.Blue]: 5,
  };

  // Set up `validColouredNumbers` mock values
  this.validColouredNumbers = {
    [DiceColour.Red]: [10, 10],
    [DiceColour.Yellow]: [10, 10],
    [DiceColour.Green]: [10, 10],
    [DiceColour.Blue]: [10, 10],
  };

  return this;
});
const fakeDice = new MockedDiceClass(MockedDie);

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
});

```