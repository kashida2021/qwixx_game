import { rowColour } from "../enums/rowColours";
import {
  SerializeGameCard,
  RowLocks,
  RowValues,
  LockRowResult,
  GameCardActionResult
} from "./QwixxBaseGameCard";

export default interface IQwixxGameCard {
  // Getters for public fields
  MarkedNumbers: RowValues;
  Numbers: number[];
  isLocked: RowLocks;
  penalties: number[];

  // Public methods
  serialize(): SerializeGameCard
  lockRow(row: rowColour): LockRowResult;
  markNumbers(row: rowColour, number: number): GameCardActionResult;
  synchronizeLockedRows(rows: rowColour[]): void;
  addPenalty(): void;
  getHighestMarkedNumber(row: rowColour): number;
  getLowestMarkedNumber(row: rowColour): number;
  hasAvailableMoves(diceValues: Partial<Record<rowColour, number[]>>): boolean;
  calculateSubtotalScore(): Record<string, number>;
  calculateScores: () => { subtotal: Record<string, number>; penalties: number, total: number };
}
