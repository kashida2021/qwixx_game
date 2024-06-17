import SixSidedDie from "./SixSidedDieClass";

export default class Dice {
  private _dice: Record<string, SixSidedDie>;
  private _diceValues: Record<string, number>;

  constructor(die: typeof SixSidedDie) {
    this._dice = {
      white1: new die(),
      white2: new die(),
      red: new die(),
      yellow: new die(),
      green: new die(),
      blue: new die(),
    };

    this._diceValues = {
      white1: 0,
      white2: 0,
      red: 0,
      yellow: 0,
      green: 0,
      blue: 0,
    };
  }

  rollAllDice(): void {
    let diceColors = Object.keys(this._dice);
    diceColors.forEach((colour) => {
      if (this._dice[colour].active === false) {
        this._diceValues[colour] = 0;
      } else {
        this._dice[colour].rollDie();
        this._diceValues[colour] = this._dice[colour].value;
      }
    });
  }

  get diceValues(): Record<string, number> {
    return this._diceValues;
  }

  disableDie(colour: string): void {
    if (this._dice[colour]) {
      this._dice[colour].disable();
    }
  }
}
