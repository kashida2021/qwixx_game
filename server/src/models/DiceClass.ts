import SixSidedDie from "./SixSidedDieClass";
import { DiceColour } from "../enums/DiceColours";

export default class Dice {
  private _dice: Record<DiceColour, SixSidedDie>;
  private _diceValues: Record<DiceColour, number>;

  constructor(die: typeof SixSidedDie) {
    this._dice = {
      [DiceColour.White1]: new die(),
      [DiceColour.White2]: new die(),
      [DiceColour.Red]: new die(),
      [DiceColour.Yellow]: new die(),
      [DiceColour.Green]: new die(),
      [DiceColour.Blue]: new die(),
    };

    this._diceValues = {
      [DiceColour.White1]: 0,
      [DiceColour.White2]: 0,
      [DiceColour.Red]: 0,
      [DiceColour.Yellow]: 0,
      [DiceColour.Green]: 0,
      [DiceColour.Blue]: 0,
    };
  }

  rollAllDice(): Record<DiceColour, number> {
    let diceColours = Object.keys(this._dice) as DiceColour[];
    diceColours.forEach((colour) => {
      const dieColour = colour as DiceColour;
      if (this._dice[dieColour].active === false) {
        this._diceValues[dieColour] = 0;
      } else {
        this._dice[dieColour].rollDie();
        this._diceValues[dieColour] = this._dice[dieColour].value;
      }
    });
    return this._diceValues;
  }

  get diceValues(): Record<DiceColour, number> {
    return this._diceValues;
  }

  disableDie(colour: DiceColour): void {
    if (this._dice[colour]) {
      this._dice[colour].disable();
    } else {
      throw new Error(`Die colour ${colour} does not exist`);
    }
  }

  serialize() {
    return this._diceValues;
  }
}
