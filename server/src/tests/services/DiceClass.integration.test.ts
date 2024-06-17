import Dice from "../../DiceClass";
import SixSidedDie from "../../SixSidedDieClass";

let testDice: Dice;

describe("Dice integration tests", () => {
  beforeEach(() => {
    testDice = new Dice(SixSidedDie);
  });

  it("should initialize with all dice values as 0", () => {
    const diceValues = Object.values(testDice.diceValues);
    diceValues.forEach((value) => {
      expect(value).toBe(0);
    });
  });

  it("should roll all dice and return values within the expected range", () => {
    testDice.rollAllDice();
    const diceValues = Object.values(testDice.diceValues);
    diceValues.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    });
  });

  it("should change the dice values after rolling", () => {
    const initialValues = Object.values(testDice.diceValues);

    testDice.rollAllDice();

    const newValues = Object.values(testDice.diceValues);

    expect(initialValues).not.toEqual(newValues);
  });

  test("disableDie() should disable the die and the value should return 0", () => {
    testDice.rollAllDice();

    testDice.disableDie("red");
    testDice.rollAllDice();

    expect(testDice.diceValues["red"]).toBe(0);
  });

  test("disabling a non-existant die should not throw an error", () => {
    expect(() => testDice.disableDie("purple")).not.toThrow(); 
  })
});
