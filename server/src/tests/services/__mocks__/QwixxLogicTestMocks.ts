import IDie from "../../../models/IDie";
import { DiceColour } from "../../../enums/DiceColours";

function createDieMock(dieValue: number): jest.Mocked<IDie>{
    return {
        get value(){
            return dieValue
        },
        get active(){
            return true;
        },
        rollDie: jest.fn().mockReturnValue(dieValue),
        disable: jest.fn(),
    }
}

export const mockSixSidedDice = {
  [DiceColour.White1]: createDieMock(2),
  [DiceColour.White2]: createDieMock(3),
  [DiceColour.Red]: createDieMock(4),
  [DiceColour.Yellow]: createDieMock(5),
  [DiceColour.Green]: createDieMock(6),
  [DiceColour.Blue]: createDieMock(1),
};
