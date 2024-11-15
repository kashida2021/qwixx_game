import SixSidedDie from "./SixSidedDieClass";
import { DiceColour } from "../enums/DiceColours";
import { rowColour } from "../enums/rowColours";

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
        // this._dice[dieColour].rollDie();
        // this._diceValues[dieColour] = this._dice[dieColour].value;
        this._diceValues[dieColour] = this._dice[dieColour].rollDie();
      }
    });
    return this._diceValues;
  }

  get diceValues(): Record<DiceColour, number> {
    return this._diceValues;
  }

  // get validColouredNumbers(): number[] {
  //   const whiteValues = [this._diceValues.white1, this._diceValues.white2];
  //   const colouredValues = [this._diceValues.red, this._diceValues.yellow, this._diceValues.green, this._diceValues.blue];
  //   return whiteValues.flatMap(white => colouredValues.filter(value => value > 0).map(value => value + white));
  // }

  get validColouredNumbers() {
    const { white1, white2, ...colouredValues } = this._diceValues;
    //const result: { [key in rowColour]?: number[] } = {};
    const result: Partial<Record<rowColour, number[]>> = {};

    for (const [colour, value] of Object.entries(colouredValues)) {
      const colourKey = colour as rowColour;
      if (value > 0) {
        result[colourKey] = [value + white1, value + white2];
      }
    }

    return result;
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
