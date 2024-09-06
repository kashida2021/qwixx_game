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
      [DiceColour.White1]: 1,
      [DiceColour.White2]: 1,
      [DiceColour.Red]: 1,
      [DiceColour.Yellow]: 1,
      [DiceColour.Green]: 1,
      [DiceColour.Blue]: 1,
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
    return {
      dice: this._diceValues,
    };
  }
}
