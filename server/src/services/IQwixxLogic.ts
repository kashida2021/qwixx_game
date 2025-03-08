import {
  RollDiceResult,
  PassMoveResult,
  MakeMoveResult,
  EndTurnResult,
  ProcessPenaltyResult,
  LockRowResult,
  SerializedGameState,
} from "./QwixxLogic";

export default interface IQwixxLogic {
  // Getters
  //Public methods
  rollDice(): RollDiceResult;
  passMove(id: string): PassMoveResult;
  makeMove(id: string, row: string, num: number): MakeMoveResult;
  endTurn(id: string): EndTurnResult;
  processPenalty(id: string): ProcessPenaltyResult;
  lockRow(id: string, row: string): LockRowResult;
  serialize(): SerializedGameState;
}
