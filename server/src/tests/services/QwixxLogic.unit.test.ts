import QwixxLogic from "../../services/QwixxLogic";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Dice from "../../models/DiceClass";
import { DiceColour } from "../../enums/DiceColours";
import SixSidedDie from "../../models/SixSidedDieClass";

// const gameCardMock: Partial<qwixxBaseGameCard> = {
//   markNumbers: jest.fn(),
// };

// const player1Mock: Partial<Player> = {
//   name: "player1",
//   // gameCard: gameCardMock as qwixxBaseGameCard,
//   hasSubmittedChoice: false,
//   serialize: jest.fn(),
//   markSubmitted: jest.fn(),
//   markNumber: jest.fn(),
// };

// const player2Mock: Partial<Player> = {
//   name: "player2",
//   // gameCard: gameCardMock as qwixxBaseGameCard,
//   hasSubmittedChoice: false,
//   serialize: jest.fn(),
//   markSubmitted: jest.fn(),
//   markNumber: jest.fn(),
// };

// const diceMock: Partial<Dice> = {
//   diceValues: {
//     [DiceColour.White1]: 5,
//     [DiceColour.White2]: 5,
//     [DiceColour.Red]: 5,
//     [DiceColour.Yellow]: 5,
//     [DiceColour.Green]: 5,
//     [DiceColour.Blue]: 5,
//   },
//   rollAllDice: jest.fn(),
//   serialize: jest.fn(),
// };

// const playersArrayMock: Player[] = [
//   player1Mock as Player,
//   player2Mock as Player,
// ];

// Need to instantiate QwixxLogic class
// I can:
//create a fake
//spyOn the method
//mock a function?

/**
 * Using inheritance to create mock
 */
// class qwixxBaseGameCardMock extends qwixxBaseGameCard {
//   markNumbers = jest.fn();
// }
// class playerMock extends Player {
//   markNumber = jest.fn();
// }

// class diceMock extends Dice {
//   get diceValues(): Record<DiceColour, number> {
//     return {
//       white1: 5,
//       white2: 5,
//       red: 5,
//       yellow: 5,
//       green: 5,
//       blue: 5,
//     };
//   }
//   rollAllDice = jest.fn();
//   serialize = jest.fn();
// }

// class SixSidedDieMock extends SixSidedDie {}

// const fakeDice = new diceMock(SixSidedDieMock);
// const gameCardMock1 = new qwixxBaseGameCardMock();
// const gameCardMock2 = new qwixxBaseGameCardMock();
// const player1Mock = new playerMock("player1", gameCardMock1);
// const player2Mock = new playerMock("player2", gameCardMock2);
// const playersArrayMock = [player1Mock, player2Mock];

const MockedGameCardClass = qwixxBaseGameCard as jest.Mocked<
  typeof qwixxBaseGameCard
>;
const gameCardMock1 = new MockedGameCardClass();
const gameCardMock2 = new MockedGameCardClass();

const player1Mock = new Player('player1', gameCardMock1) as jest.Mocked<Player>;
player1Mock.markNumber = jest.fn();
(player1Mock.markNumber as jest.Mock).mockReturnValue(true);

const player2Mock = new Player('player2', gameCardMock1) as jest.Mocked<Player>;
player2Mock.markNumber = jest.fn();
(player2Mock.markNumber as jest.Mock).mockReturnValue(true);

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

const playersArrayMock = [player1Mock, player2Mock];

describe("Qwixx Logic tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should call the markNumber method with correct args", () => {
    // (player1Mock.markNumber as jest.Mock).mockReturnValue(true);

    // Only works when extending Player class
    // player1Mock.markNumber.mockReturnValue(true);
    // const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);
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
    // (player2Mock.markNumber as jest.Mock).mockReturnValue(true);
    // player2Mock.markNumber.mockReturnValue(true);
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
      // const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);

      jest.spyOn(player1Mock, "submissionCount", "get").mockReturnValue(1);
      // (player1Mock.markNumber as jest.Mock).mockReturnValue(true);
      // player1Mock.markNumber.mockReturnValue(true);
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
