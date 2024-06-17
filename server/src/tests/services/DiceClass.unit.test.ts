import Dice from "../../DiceClass";

describe("Dice Class tests", () => {
  it("should roll all dice and return an object with length of 6", () => {
    const testDice = new Dice();
    testDice.rollAllDice();
    const result = testDice.diceValues;
    expect(Object.keys(result).length).toBe(6);
  });

  it("should roll all dice and return values within the expected range", () => {
    const testDice = new Dice();
    testDice.rollAllDice();
    const result = testDice.diceValues;
    for (const prop in result) {
      expect(result[prop]).toBeGreaterThanOrEqual(1);
      expect(result[prop]).toBeLessThanOrEqual(6);
    }
  });
});
