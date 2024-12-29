import SixSidedDie from "./SixSidedDieClass"
import IDie from "./IDie"
import { DiceColour } from "../enums/DiceColours"

export default function initializeDice(): Record<DiceColour, IDie> {
  return {
    [DiceColour.White1]: new SixSidedDie(),
    [DiceColour.White2]: new SixSidedDie(),
    [DiceColour.Red]: new SixSidedDie(),
    [DiceColour.Yellow]: new SixSidedDie(),
    [DiceColour.Green]: new SixSidedDie(),
    [DiceColour.Blue]: new SixSidedDie(),
  }
}
