import GameBoard from "../../models/GameBoardTemp";
import GameBoardTemp from "../../models/GameBoardTemp";
import { rowColour } from "../../enums/rowColours";

let testGameBoard: GameBoard;

describe("gameboard temp test", () => {
  beforeEach(() => {
    testGameBoard = new GameBoard();
  });
  test("get back rows", () => {
    const rows = testGameBoard.MarkedNumbers;
    console.log(rows);
    expect(rows).toEqual({ red: [], yellow: [], green: [], blue: [] });
  });

  test("get back numbers", () => {
    const numbers = testGameBoard.Numbers;
    console.log(numbers);
    expect(numbers).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  test.each([
    [rowColour.Red, 5, { red: [5], yellow: [], green: [], blue: [] }],
    [rowColour.Blue, 10, { red: [], yellow: [], green: [], blue: [10] }],
    [rowColour.Green, 8, { red: [], yellow: [], green: [8], blue: [] }],
    [rowColour.Yellow, 6, { red: [], yellow: [6], green: [], blue: [] }],
  ])("mark %s %d on board", (a, b, expected) => {
    testGameBoard.markNumbers(a, b);
    const rows = testGameBoard.MarkedNumbers;
    expect(rows).toEqual(expected);
  });

  test("mark numbers already on board", () => {
    testGameBoard.markNumbers(rowColour.Red, 5);
    testGameBoard.markNumbers(rowColour.Red, 5);
    const rows = testGameBoard.MarkedNumbers;
    expect(rows).toEqual({ red: [5], yellow: [], green: [], blue: [] });
  });
});
