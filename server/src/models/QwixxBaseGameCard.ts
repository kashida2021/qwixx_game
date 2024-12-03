import { rowColour } from "../enums/rowColours";

interface MarkNumbersSuccess {
  success: true;
}

interface MarkNumbersFailure {
  success: false;
  errorMessage: string;
}

type MarkNumbersResult = MarkNumbersSuccess | MarkNumbersFailure
type IsValidMoveResult = MarkNumbersSuccess | MarkNumbersFailure
type LockRowResult =
  | { success: true; lockedRow: rowColour }
  | { success: false; errorMessage: string }

type RowValues = Record<rowColour, number[]>
type RowLocks = Record<rowColour, boolean>

export interface SerializeGameCard {
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

  public normaliseRows(rows: rowColour[]) {
    //    this._isLocked[row] = true
    rows.forEach(row => this._isLocked[row] = true)
  }

  public lockRow(row: rowColour): LockRowResult {
    if (row === rowColour.Red || row === rowColour.Yellow) {
      if (this._rows[row].length < 6 && this.getHighestMarkedNumber(row) !== 12) {
        return { success: false, errorMessage: "Didn't satisfy conditions to lock a row." }
      }
      this.addNumberToRow(row, 13)
    }

    if (row === rowColour.Green || row === rowColour.Blue) {
      if (this._rows[row].length < 6 && this.getLowestMarkedNumber(row) !== 2) {
        return { success: false, errorMessage: "Didn't satisfy conditions to lock a row." }
      }
      this.addNumberToRow(row, 1)
    }

    this._isLocked[row] = true
    return { success: true, lockedRow: row }
  }

  public markNumbers(row: rowColour, number: number): MarkNumbersResult {
    if (this._rows[row].includes(number)) {
      return { success: false, errorMessage: `Number ${number} is already marked in ${row} row.` }
    }

    //if (!this.isValidMove(row, number)) {
    //  return {
    //    success: false, errorMessage:
    //      "Invalid move. Number is not higher/lower than previous marked number"
    //  }
    //}

    // TODO: Is it better to move this check into 'isValidMove'?
    if (this.isLocked[row]) {
      return { success: false, errorMessage: `${row} row is already locked.` }
    }

    const res = this.isValidMove(row, number)

    if (!res.success) {
      return { success: res.success, errorMessage: res.errorMessage }
    }

    this.addNumberToRow(row, number)

    return { success: true }

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

  //TODO: maybe change to private
  public getHighestMarkedNumber(row: rowColour): number {
    const markedNumbers = this._rows[row];
    return markedNumbers.length ? Math.max(...markedNumbers) : 1;
  }

  //TODO: maybe change to private
  public getLowestMarkedNumber(row: rowColour): number {
    const markedNumbers = this._rows[row];
    return markedNumbers.length ? Math.min(...markedNumbers) : 13;
  }

  // TODO: Better error handling for when colour is invalid.
  // It should already be validated in QwixxLogic but it is also being handled here.
  private isValidMove(colour: rowColour, num: number): IsValidMoveResult {
    if (colour === rowColour.Red || colour === rowColour.Yellow) {
      if (num < 12 && this.getHighestMarkedNumber(colour) > num) {
        //return this.getHighestMarkedNumber(colour) < num;
        return {
          success: false,
          errorMessage:
            "Invalid move. Number is not greater than previous marked number"
        }
      }
      if (num === 12 && this.MarkedNumbers[colour].length < 5) {
        //return this.MarkedNumbers[colour].length >= 5
        return {
          success: false,
          errorMessage:
            "Number 12 can't be marked. 5 lower values numbers haven't been marked yet"
        }
      }
    }

    if (colour === rowColour.Blue || colour === rowColour.Green) {
      //      return this.getLowestMarkedNumber(colour) > num;
      if (num > 2 && this.getLowestMarkedNumber(colour) < num) {
        return {
          success: false,
          errorMessage:
            "Invalid move. Number is not less than previous marked number"
        }
      }
      if (num === 2 && this.MarkedNumbers[colour].length! < 5) {
        return {
          success: false,
          errorMessage:
            "Number 2 can't be marked. 5 higher values numbers haven't been marked yet"
        }
      }
    }
    return { success: true };
  }

  // TODO: Doesn't check valid moves for white1 + white2
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
