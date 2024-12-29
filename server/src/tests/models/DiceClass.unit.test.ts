import Dice from "../../models/DiceClass";
import SixSidedDie from "../../models/SixSidedDieClass";
import IDice from "../../models/IDice";
import IDie from "../../models/IDie";
import { DiceColour } from "../../enums/DiceColours";

const createDieMock = (): jest.Mocked<IDie> => {
  return {
    get value(){
      return 1
    },
    get active(){
      return true;
    },
    rollDie: jest.fn(),
    disable: jest.fn(),
  }
}

const mockSixSidedDice = {
  [DiceColour.White1]: createDieMock(),
  [DiceColour.White2]: createDieMock(),
  [DiceColour.Red]: createDieMock(),
  [DiceColour.Yellow]: createDieMock(),
  [DiceColour.Green]: createDieMock(),
  [DiceColour.Blue]: createDieMock(),
}

describe("DiceClass unit test", () => {
  let testDice: IDice;
  beforeEach(() => {
    testDice = new Dice(mockSixSidedDice);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should return valid sums when dice values are positive numbers", () => {
    mockSixSidedDice[DiceColour.White1].rollDie.mockReturnValue(2)
    mockSixSidedDice[DiceColour.White2].rollDie.mockReturnValue(3)
    mockSixSidedDice[DiceColour.Red].rollDie.mockReturnValue(4)
    mockSixSidedDice[DiceColour.Yellow].rollDie.mockReturnValue(6)
    mockSixSidedDice[DiceColour.Green].rollDie.mockReturnValue(5)
    mockSixSidedDice[DiceColour.Blue].rollDie.mockReturnValue(1)

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
    mockSixSidedDice[DiceColour.White1].rollDie.mockReturnValue(2)
    mockSixSidedDice[DiceColour.White2].rollDie.mockReturnValue(3)
    mockSixSidedDice[DiceColour.Red].rollDie.mockReturnValue(4)
    mockSixSidedDice[DiceColour.Yellow].rollDie.mockReturnValue(0)
    mockSixSidedDice[DiceColour.Green].rollDie.mockReturnValue(5)
    mockSixSidedDice[DiceColour.Blue].rollDie.mockReturnValue(0)

    const expectedNumbers = {
      red: [6, 7],
      green: [7, 8],
    };

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual(expectedNumbers);
  });

  it("should ignore sums involving dice of negative values", () => {
    mockSixSidedDice[DiceColour.White1].rollDie.mockReturnValue(2)
    mockSixSidedDice[DiceColour.White2].rollDie.mockReturnValue(3)
    mockSixSidedDice[DiceColour.Red].rollDie.mockReturnValue(-3)
    mockSixSidedDice[DiceColour.Yellow].rollDie.mockReturnValue(-4)
    mockSixSidedDice[DiceColour.Green].rollDie.mockReturnValue(5)
    mockSixSidedDice[DiceColour.Blue].rollDie.mockReturnValue(-1)

    const expectedNumbers = {
      green: [7, 8],
    }

    testDice.rollAllDice();

    const validColouredNumbers = testDice.validColouredNumbers;

    expect(validColouredNumbers).toEqual(expectedNumbers);
  });

  it("should hanlde duplicate sums for duplicate values", () => {
    mockSixSidedDice[DiceColour.White1].rollDie.mockReturnValue(2)
    mockSixSidedDice[DiceColour.White2].rollDie.mockReturnValue(2)
    mockSixSidedDice[DiceColour.Red].rollDie.mockReturnValue(5)
    mockSixSidedDice[DiceColour.Yellow].rollDie.mockReturnValue(4)
    mockSixSidedDice[DiceColour.Green].rollDie.mockReturnValue(5)
    mockSixSidedDice[DiceColour.Blue].rollDie.mockReturnValue(4)

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