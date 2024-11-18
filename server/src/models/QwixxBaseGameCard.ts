import { rowColour } from "../enums/rowColours";

type RowValues = Record<rowColour, number[]>
type RowLocks = Record<rowColour, boolean>

interface SerializeGameCard {
  rows: RowValues;
  isLocked: RowLocks;
  penalties: number[];
}

export default class qwixxBaseGameCard {
  private _rows: RowValues;
  private _numbers: number[];
  private _isLocked: RowLocks;
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

  public serialize(): SerializeGameCard {
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

  private addNumberToRow(row: rowColour, number: number) {
    this._rows[row].push(number)
  }

  public markNumbers(row: rowColour, number: number) {
    if (!this.isValidMove(row, number) || this._rows[row].includes(number)) {
      return false
    }

    this.addNumberToRow(row, number)
    return true

    //    this._rows[row].push(number)

    //    if (!this._rows[row].includes(number)) {
    //      this._rows[row].push(number);
    //      return true;
    //    } else {
    //      return false;
    //    }
  }

  get isLocked() {
    return this._isLocked;
  }

  get penalties() {
    return this._penalties;
  }

  public addPenalty() {
    this._penalties.push(this._penalties.length + 1);
  }

  //TODO maybe change to private
  public getHighestMarkedNumber(row: rowColour): number {
    const markedNumbers = this._rows[row];
    return markedNumbers.length ? Math.max(...markedNumbers) : 1;
  }

  //TOOD maybe change to private
  public getLowestMarkedNumber(row: rowColour): number {
    const markedNumbers = this._rows[row];
    return markedNumbers.length ? Math.min(...markedNumbers) : 13;
  }

  private isValidMove(colour: rowColour, num: number): boolean {
    if (colour === rowColour.Red || colour === rowColour.Yellow) {
      return this.getHighestMarkedNumber(colour) < num;
    }

    if (colour === rowColour.Blue || colour === rowColour.Green) {
      return this.getLowestMarkedNumber(colour) > num;
    }
    return false;
  }

  public hasAvailableMoves(
    diceValues: Partial<Record<rowColour, number[]>>
  ): boolean {
    for (const row in diceValues) {
      const colour = row as rowColour;
      const [num1, num2] = diceValues[colour] ?? [];

      if (num1 !== undefined && num2 !== undefined) {
        if (this.isValidMove(colour, num1) || this.isValidMove(colour, num2)) {
          return true;
        }
      }
    }
    return false;
  }
}
