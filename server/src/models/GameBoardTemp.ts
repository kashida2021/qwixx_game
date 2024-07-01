import { rowColour } from "../enums/rowColours";

export default class GameBoard {
  private _rows: { [key in rowColour]: number[] };
  private _numbers: number[];
  private _lockedRows: string[];
  private _penalties: number[];

  constructor() {
    this._rows = {
      [rowColour.Red]: [],
      [rowColour.Yellow]: [],
      [rowColour.Green]: [],
      [rowColour.Blue]: [],
    };

    this._numbers = Array.from({ length: 12 }, (_, i) => i + 2);

    this._lockedRows = [];

    this._penalties = [];
  }

  serialize() {
    return {
      gameBoard: this._rows,
      numbers: this._numbers,
      lockedRows: this._lockedRows,
      penalties: this._penalties,
    };
  }

  static from(data: any): GameBoard {
    const gameBoard = new GameBoard();
    gameBoard._rows = data.gameBoard;
    gameBoard._numbers = data.numbers;
    gameBoard._lockedRows = data.lockedRows;
    gameBoard._penalties = data.penalties;
    return gameBoard;
  }

  get MarkedNumbers() {
    return this._rows;
  }

  get Numbers() {
    return this._numbers;
  }

  markNumbers(row: rowColour, number: number) {
    if (!this._rows[row].includes(number)) {
      this._rows[row].push(number);
      return true
    }else{
      return false
    }
  }

  getLockedRows() {
    return this._lockedRows;
  }

  getPenalties() {
    return this._penalties;
  }
}
