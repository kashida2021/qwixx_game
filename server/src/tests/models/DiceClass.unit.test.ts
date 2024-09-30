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

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual([6, 8, 7, 3, 7, 9, 8, 4]);
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

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual([6, 7, 7, 8]);
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

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual([7, 8]);
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

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual([7, 6, 7, 6, 7, 6, 7, 6]);
  });
});
