import SixSidedDie from "./SixSidedDieClass";

let testDie: SixSidedDie; 

describe("Die Class tests", () => {
  beforeEach(() => {
    testDie = new SixSidedDie();
  });

  it("Should return its value", () => {
    expect(testDie.value).toEqual(0);
  });

  test("When the rollDie method is called it updates the die's value", () => {
    testDie.rollDie();
    const rollResult = testDie.value;
    expect(rollResult).toBeGreaterThanOrEqual(1);
    expect(rollResult).toBeLessThanOrEqual(6);
  });

  test("rollDie() should generate values within the expected range", () => {
    const numRolls = 100;

    for (let i = 0; i < numRolls; i++) {
      testDie.rollDie();
      const rollResult = testDie.value;

      expect(rollResult).toBeGreaterThanOrEqual(1);
      expect(rollResult).toBeLessThanOrEqual(6);
    }
  });

  test("rollDie() should exhibit reasonable randomness over multiple calls", () => {
    const numRolls = 100;

    const result: number[] = [];

    for (let i = 0; i < numRolls; i++) {
      testDie.rollDie();
      result.push(testDie.value);
    }

    const uniqueResults = new Set(result);
    expect(uniqueResults.size).toBeGreaterThan(1);
    expect(uniqueResults.size).toBeLessThan(7);
  });
});
