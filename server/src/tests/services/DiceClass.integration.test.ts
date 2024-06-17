import Dice from "../../DiceClass";
import SixSidedDie from "../../SixSidedDieClass";

describe("Dice integration tests", () => {
  it("should roll all dice and return values within the expected range", () => {
    const testDice = new Dice(SixSidedDie);
    testDice.rollAllDice();
    const result = testDice.diceValues.slice();
    result.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(6);
    });
  });

  it("should change the dice values after rolling", () => {
    const testDice = new Dice(SixSidedDie);
    const initialValues = testDice.diceValues.slice();

    testDice.rollAllDice();

    const newValues = testDice.diceValues.slice();

    expect(initialValues).not.toEqual(newValues);
  });
});
