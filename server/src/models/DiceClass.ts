import SixSidedDie from "./SixSidedDieClass";
import { DiceColour } from "../enums/DiceColours";
import { rowColour } from "../enums/rowColours";
import IDice from "./IDice";
import IDie from "./IDie";

type TDice = Record<DiceColour, IDie>;
export type TDiceValues = Record<DiceColour, number>;

export default class Dice implements IDice {
  private _dice: TDice;
  private _diceValues: TDiceValues;

  constructor(dice: Record<DiceColour, IDie>) {
    this._dice = dice;

    this._diceValues = {
      [DiceColour.White1]: 1,
      [DiceColour.White2]: 1,
      [DiceColour.Red]: 1,
      [DiceColour.Yellow]: 1,
      [DiceColour.Green]: 1,
      [DiceColour.Blue]: 1,
    };
  }

  get diceValues(): TDiceValues {
    return this._diceValues;
  }

  public get whiteDiceSum() {
    return this.diceValues.white1 + this.diceValues.white2;
  }

  /**
   * @description Returns all possible number combinations for white and coloured dice in accordance to game rules
   * @returns An object mapping dice colours to an array of white die + the respective coloured die's value
   */
  public get validColouredNumbers() {
    const { white1, white2, ...colouredValues } = this.diceValues;
    const result: Partial<Record<rowColour, number[]>> = {};

    for (const [colour, value] of Object.entries(colouredValues)) {
      const colourKey = colour as rowColour;
      if (value > 0) {
        result[colourKey] = [value + white1, value + white2];
      }
    }

    return result;
  }

  public rollAllDice(): TDiceValues {
    let diceColours = Object.keys(this._dice) as DiceColour[];
    diceColours.forEach((colour) => {
      const dieColour = colour as DiceColour;
      this.diceValues[dieColour] = this._dice[dieColour].rollDie();
    });
    return this.diceValues;
  }

  public disableDie(colour: DiceColour): void {
    if (this._dice[colour]) {
      this._dice[colour].disable();
    } else {
      throw new Error(`Die colour ${colour} does not exist`);
    }
  }

  serialize(): TDiceValues {
    return this.diceValues;
  }
}
