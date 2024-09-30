import Dice from "../../models/DiceClass";
import SixSidedDie from "../../models/SixSidedDieClass";
import { DiceColour } from "../../enums/DiceColours";

describe("DiceClass unit test", () => {
  let testDice: Dice;
  beforeEach(() => {
    testDice = new Dice(SixSidedDie);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it("should return valid sums when dice values are positive numbers", () => {
    SixSidedDie.prototype.rollDie = jest
      .fn()
      .mockReturnValueOnce(2) // Mock for White1
      .mockReturnValueOnce(3) // Mock for White2
      .mockReturnValueOnce(4) // Mock for Red
      .mockReturnValueOnce(6) // Mock for Yellow (should be ignored)
      .mockReturnValueOnce(5) // Mock for Green
      .mockReturnValueOnce(1); // Mock for Blue (should be ignored)

    const expectedNumbers = {
      red: [6, 7],
      yellow: [8, 9],
      green: [7, 8],
      blue: [3, 4],
    };

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual(expectedNumbers);
  });

  it("should ignore sums involving dice values of 0", () => {
    SixSidedDie.prototype.rollDie = jest
      .fn()
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(0);

    const expectedNumbers = {
      red: [6, 7],
      // yellow: [],
      green: [7, 8],
      // blue: [],
    };

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual(expectedNumbers);
  });

  it("should ignore sums involving dice of negative values", () => {
    SixSidedDie.prototype.rollDie = jest
      .fn()
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(3)
      .mockReturnValueOnce(-3)
      .mockReturnValueOnce(-4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(-1);

    const expectedNumbers = {
      green: [7, 8],
    }

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual(expectedNumbers);
  });

  it("should hanlde duplicate sums for duplicate values", () => {
    SixSidedDie.prototype.rollDie = jest
      .fn()
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(4);

    const expectedNumbers = {
      red: [7, 7], 
      yellow: [6, 6],
      green: [7, 7], 
      blue: [6, 6], 
    }
    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual(expectedNumbers);
  });
});

// diceValues = {
//   red: [3,5],
//   yellow: [4,6],
//   green: [8,5],
//   blue: [3,4],
// }

// !validColouredNumbers[colourToMark].includes(num)
