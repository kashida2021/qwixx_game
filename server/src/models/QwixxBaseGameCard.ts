import { rowColour } from "../enums/rowColours";

export default class qwixxBaseGameCard {
  private _rows: { [key in rowColour]: number[] };
  private _numbers: number[];
  private _isLocked: { [key in rowColour]: boolean };
  private _penalties: number[];

  constructor() {
    this._rows = {
      [rowColour.Red]: [],
      [rowColour.Yellow]: [],
      [rowColour.Green]: [],
      [rowColour.Blue]: [],
    };

    this._numbers = Array.from({ length: 12 }, (_, i) => i + 2);

    this._isLocked = {
      [rowColour.Red]: false,
      [rowColour.Yellow]: false,
      [rowColour.Green]: false,
      [rowColour.Blue]: false,
    };

    this._penalties = [];
  }

  serialize() {
    return {
      rows: this._rows,
      isLocked: this._isLocked,
      penalties: this._penalties,
    };
  }

  get MarkedNumbers() {
    return this._rows;
  }

  get Numbers() {
    return this._numbers;
  }

  public markNumbers(row: rowColour, number: number) {
    if (!this._rows[row].includes(number)) {
      this._rows[row].push(number);
      return true;
    } else {
      return false;
    }
  }

  get isLocked() {
    return this._isLocked;
  }

  get penalties() {
    return this._penalties;
  }

  public addPenalty() {
    this._penalties.push(1);
  }

  public getHighestMarkedNumber(row: rowColour): number {
    const markedNumbers = this._rows[row];
    return markedNumbers.length ? Math.max(...markedNumbers) : 1;
  }

  public getLowestMarkedNumber(row: rowColour): number {
    const markedNumbers = this._rows[row];
    return markedNumbers.length ? Math.min(...markedNumbers) : 13;
  }
}
