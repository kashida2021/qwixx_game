import { rowColour } from "../../enums/rowColours";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";

let testGameCard: qwixxBaseGameCard;

describe("gameboard temp test", () => {
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

  test("mark numbers already on board", () => {
    testGameCard.markNumbers(rowColour.Red, 5);
    testGameCard.markNumbers(rowColour.Red, 5);
    const rows = testGameCard.MarkedNumbers;
    expect(rows).toEqual({ red: [5], yellow: [], green: [], blue: [] });
  });

  test.only("get back highest and lowest marked numbers", () => {
    testGameCard.markNumbers(rowColour.Red, 5);
    const numbers = testGameCard.getHighestLowestMarkedNumbers();
    expect(numbers).toEqual({ red: 5, yellow: 1, blue: 13, green: 13 });
  });
});
