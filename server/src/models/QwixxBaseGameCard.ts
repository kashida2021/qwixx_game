import { rowColour } from "../enums/rowColours";
import IQwixxGameCard from "./IQwixxGameCard";

// TODO: Delete these interfaces and types
//interface MarkNumbersSuccess {
//  success: true;
//}
//
//interface MarkNumbersFailure {
//  success: false;
//  errorMessage: string;
//}
//
//type MarkNumbersResult = MarkNumbersSuccess | MarkNumbersFailure
//type IsValidMoveResult = MarkNumbersSuccess | MarkNumbersFailure

/**
 * Represents the reuslt of an action that can succeed or fail.
 * - `success: true`: action was successful.
 * - `success: false`: action failed with an optional `errorMessage`.
 */
export type GameCardActionResult =
  | { success: true }
  | { success: false; errorMessage: string };

// Result for locking rows, which includes additional data in the success case
export type LockRowResult =
  | { success: true; lockedRow: rowColour }
  | { success: false; errorMessage?: string };

// Represents the structure of row values on the game card
export type RowValues = Record<rowColour, number[]>;

export type RowScores = Record<rowColour, number>;

// Represents the locking state of rows on the game card
export type RowLocks = Record<rowColour, boolean>;

// Defines the serialized state of a game card
export interface SerializeGameCard {
  rows: RowValues;
  isLocked: RowLocks;
  penalties: number[];
}

export default class qwixxBaseGameCard implements IQwixxGameCard {
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

  get MarkedNumbers() {
    return this._rows;
  }

  get Numbers() {
    return this._numbers;
  }

  get isLocked() {
    return this._isLocked;
  }

  get penalties() {
    return this._penalties;
  }

  private addNumberToRow(row: rowColour, number: number) {
    this._rows[row].push(number);
  }

  public serialize(): SerializeGameCard {
    return {
      rows: this._rows,
      isLocked: this._isLocked,
      penalties: this._penalties,
    };
  }

  /**
   * @description Synchronizes the locked state of rows across all players.
   *  Ensures that when a row is locked by one player, it is locked for all players by the end of the turn,
   *  in accordane with game rules.
   * @param rows - The list of row colors to normalize.
   */
  public synchronizeLockedRows(rows: rowColour[]) {
    rows.forEach((row) => (this._isLocked[row] = true));
  }

  /**
   * @description Locks a row and adds the final number to the row fields if conditions are met.
   * @returns The result of the operation, including the locked row on success or an error message on failure.
   * */
  public lockRow(row: rowColour): LockRowResult {
    if (row === rowColour.Red || row === rowColour.Yellow) {
      if (
        this._rows[row].length < 6 &&
        this.getHighestMarkedNumber(row) !== 12
      ) {
        return {
          success: false,
          errorMessage: "Didn't satisfy conditions to lock a row.",
        };
      }
      this.addNumberToRow(row, 13);
    }

    if (row === rowColour.Green || row === rowColour.Blue) {
      if (this._rows[row].length < 6 && this.getLowestMarkedNumber(row) !== 2) {
        return {
          success: false,
          errorMessage: "Didn't satisfy conditions to lock a row.",
        };
      }
      this.addNumberToRow(row, 1);
    }

    this._isLocked[row] = true;
    return { success: true, lockedRow: row };
  }

  /**
   * @description Adds a number to the corresponding coloured row if the number is valid.
   * @returns The result of the operation, indicating success or failure with an optional error message.
   * */
  public markNumbers(row: rowColour, number: number): GameCardActionResult {
    if (this._rows[row].includes(number)) {
      return {
        success: false,
        errorMessage: `Number ${number} is already marked in ${row} row.`,
      };
    }

    //if (!this.isValidMove(row, number)) {
    //  return {
    //    success: false, errorMessage:
    //      "Invalid move. Number is not higher/lower than previous marked number"
    //  }
    //}

    // NOTE: Is it better to move this check into 'isValidMove'?
    if (this.isLocked[row]) {
      return { success: false, errorMessage: `${row} row is already locked.` };
    }

    const res = this.isValidMove(row, number);

    if (!res.success) {
      return { success: res.success, errorMessage: res.errorMessage };
    }

    this.addNumberToRow(row, number);

    return { success: true };

    //    this._rows[row].push(number)

    //    if (!this._rows[row].includes(number)) {
    //      this._rows[row].push(number);
    //      return true;
    //    } else {
    //      return false;
    //    }
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
  private isValidMove(colour: rowColour, num: number): GameCardActionResult {
    if (colour === rowColour.Red || colour === rowColour.Yellow) {
      if (num < 12 && this.getHighestMarkedNumber(colour) > num) {
        //return this.getHighestMarkedNumber(colour) < num;
        return {
          success: false,
          errorMessage:
            "Invalid move. Number is not greater than previous marked number",
        };
      }
      if (num === 12 && this.MarkedNumbers[colour].length < 5) {
        //return this.MarkedNumbers[colour].length >= 5
        return {
          success: false,
          errorMessage:
            "Number 12 can't be marked. 5 lower values numbers haven't been marked yet",
        };
      }
    }

    if (colour === rowColour.Blue || colour === rowColour.Green) {
      //      return this.getLowestMarkedNumber(colour) > num;
      if (num > 2 && this.getLowestMarkedNumber(colour) < num) {
        return {
          success: false,
          errorMessage:
            "Invalid move. Number is not less than previous marked number",
        };
      }
      if (num === 2 && this.MarkedNumbers[colour].length! < 5) {
        return {
          success: false,
          errorMessage:
            "Number 2 can't be marked. 5 higher values numbers haven't been marked yet",
        };
      }
    }
    return { success: true };
  }

  // TODO: Doesn't check valid moves for white1 + white2
  /**
   * @description Determines whether there are any available moves based on the provided dice values.
   * @param diceValues - A partial mapping of row colors to dice values.
   * @returns `true` if there are available moves, `false` otherwise.
   */
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

  /**
   * @description Calculates the subtotal score for each row.
   * @returns An object mapping row colors to their respective scores.
   */
  public calculateSubtotalScore(): Record<rowColour, number> {
    // NOTE: Would it be more scalable if this multiplier was a part of the constructor?
    const multiplier = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78];

    return Object.fromEntries(
      Object.entries(this.MarkedNumbers)
        .map(([row, numbers]) => [row, multiplier[numbers.length]])
    ) as Record<rowColour, number>
  }

  /**
   * @description Calculates the total score, including subtotals for each row and penalties.
   * @returns An object containing:
   * - `subtotal`: A mapping of row colors to their respective scores.
   * - `penalties`: The total penalty points.
   * - `total`: The overall score after subtracting penalties.
   */
  public calculateScores(): {
    subtotal: Record<rowColour, number>;
    penalties: number;
    total: number;
  } {
    //const multiplier = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78]
    //const score = Object.values(this.MarkedNumbers).reduce((score, row) => score + multiplier[row.length], 0)

    const subtotal = this.calculateSubtotalScore();
    const score = Object.values(subtotal).reduce(
      (sum, rowScore) => sum + rowScore,
      0
    );
    const penalties = this.calculatePenalties();
    const total = score - penalties;

    return { subtotal, penalties, total };
  }

  private calculatePenalties(): number {
    const multiplier = 5;
    const penalties = this.penalties.at(-1) || 0;
    return multiplier * penalties;
  }
}
