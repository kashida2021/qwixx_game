import SixSidedDie from "./SixSidedDieClass";

export default class Dice {
  private _dice: SixSidedDie[];
  private _diceValues: number[]; 

  constructor(die: typeof SixSidedDie) {
    this._dice = Array.from({ length: 6 }, () => new die());
    this._diceValues = [0,0,0,0,0,0]
  }

  rollAllDice(): void {
    this._dice.forEach((die, index) => {
        die.rollDie(); 
        this._diceValues[index] = die.value; 
    })
  }

  get diceValues(): number[] {
    return this._diceValues; 
  }
}
