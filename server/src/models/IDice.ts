import { DiceColour } from "../enums/DiceColours";
import { rowColour } from "../enums/rowColours";
import { TDiceValues } from "./DiceClass";

export default interface IDice {
  // Getters for public fields
  diceValues: TDiceValues;
  whiteDiceSum: number;
  validColouredNumbers: Partial<Record<rowColour, number[]>>;

  // Public methods
  rollAllDice(): TDiceValues;
  disableDie(colour: DiceColour): void;
  serialize(): TDiceValues;
}
