import { rowColour } from "../../enums/rowColours";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";

let testGameCard: qwixxBaseGameCard;

describe("Base Game Card test", () => {
  beforeEach(() => {
    testGameCard = new qwixxBaseGameCard();
  });
  test("get back rows", () => {
    const rows = testGameCard.MarkedNumbers;
    //console.log(rows);
    expect(rows).toEqual({ red: [], yellow: [], green: [], blue: [] });
  });

  test("get back numbers", () => {
    const numbers = testGameCard.Numbers;
    //console.log(numbers);
    expect(numbers).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  test.each([
    [rowColour.Red, 5, { red: [5], yellow: [], green: [], blue: [] }],
    [rowColour.Blue, 10, { red: [], yellow: [], green: [], blue: [10] }],
    [rowColour.Green, 8, { red: [], yellow: [], green: [8], blue: [] }],
    [rowColour.Yellow, 6, { red: [], yellow: [6], green: [], blue: [] }],
  ])("mark %s %d on board", (a, b, expected) => {
    testGameCard.markNumbers(a, b);
    const rows = testGameCard.MarkedNumbers;
    expect(rows).toEqual(expected);
  });

  test("Can't mark numbers already on board", () => {
    testGameCard.markNumbers(rowColour.Red, 5);
    const result = testGameCard.markNumbers(rowColour.Red, 5);
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.errorMessage).toBe("Number 5 is already marked in red row.")
    }

    const rows = testGameCard.MarkedNumbers;
    expect(rows).toEqual({ red: [5], yellow: [], green: [], blue: [] });
  });

  test("Can't mark a number that is lower than previous number on red row", () => {
    testGameCard.markNumbers(rowColour.Red, 5);
    const result = testGameCard.markNumbers(rowColour.Red, 4);
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.errorMessage).toBe(
        "Invalid move. Number is not higher/lower than previous marked number"
      )
    }

    const rows = testGameCard.MarkedNumbers;
    expect(rows).toEqual({ red: [5], yellow: [], green: [], blue: [] });
  })

  test("Can't mark a number that is higher than previous number on blue row", () => {
    testGameCard.markNumbers(rowColour.Blue, 5);
    const result = testGameCard.markNumbers(rowColour.Blue, 6);
    expect(result.success).toBeFalsy()
    if (!result.success) {
      expect(result.errorMessage).toBe(
        "Invalid move. Number is not higher/lower than previous marked number"
      )
    }

    const rows = testGameCard.MarkedNumbers;
    expect(rows).toEqual({ red: [], yellow: [], green: [], blue: [5] });
  })

  test("return true if there are available moves based on current gamecard", () => {
    const obj = {
      [rowColour.Red]: [4, 8],
      [rowColour.Yellow]: [5, 10],
      [rowColour.Blue]: [10, 6],
      [rowColour.Green]: [11, 7],
    };

    const res = testGameCard.hasAvailableMoves(obj);
    expect(res).toBeTruthy();
  });

  it("can add penalty to game card", () => {
    testGameCard.addPenalty()
    const penalties = testGameCard.penalties
    expect(penalties).toEqual([1,])
  })

  test.each([
    [rowColour.Red, [2, 3, 4, 5, 6, 12], { red: [2, 3, 4, 5, 6, 12], yellow: [], green: [], blue: [] }],
    [rowColour.Yellow, [2, 3, 4, 5, 6, 12], { red: [], yellow: [2, 3, 4, 5, 6, 12], green: [], blue: [] }],
    [rowColour.Green, [12, 11, 10, 9, 8, 2], { red: [], yellow: [], green: [12, 11, 10, 9, 8, 2], blue: [] }],
    [rowColour.Blue, [12, 11, 10, 9, 8, 2], { red: [], yellow: [], green: [], blue: [12, 11, 10, 9, 8, 2] }],
  ])("can mark final number on %s row if atleast 5 numbers in row", (row, numbers, expected) => {
    numbers.forEach(num => testGameCard.markNumbers(row, num))

    const rows = testGameCard.MarkedNumbers;
    expect(rows).toEqual(expected)
  })

  const redYellowRowErrMsg = "Number 12 can't be marked. 5 lower values numbers haven't been marked yet";
  test.each([
    [rowColour.Red, 12, { success: false, errorMessage: redYellowRowErrMsg }],
    [rowColour.Yellow, 12, { success: false, errorMessage: redYellowRowErrMsg }],
  ])("can't mark %s 12 if row doesn't have atleast 5 numbers in it", (row, number, expected) => {
    const res = testGameCard.markNumbers(row, number)
    expect(res).toEqual(expected)
  })

  const greenBlueRowErrMsg = "Number 2 can't be marked. 5 higher values numbers haven't been marked yet";
  test.each([
    [rowColour.Green, 2, { success: false, errorMessage: greenBlueRowErrMsg }],
    [rowColour.Blue, 2, { success: false, errorMessage: greenBlueRowErrMsg }],
  ])("can't mark %s 12 if row doesn't have atleast 5 numbers in it", (row, number, expected) => {
    const res = testGameCard.markNumbers(row, number)
    expect(res).toEqual(expected)
  })
});
