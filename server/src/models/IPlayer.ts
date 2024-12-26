import { rowColour } from "../enums/rowColours";
import IQwixxGameCard from "./IQwixxGameCard";
import { SerializePlayer, MarkNumberResult } from "./PlayerClass";

export default interface IPlayer {
  // Getters for public fields
  name: string;
  gameCard: IQwixxGameCard;
  hasSubmittedChoice: boolean;
  submissionCount: number;

  // Public methods
  resetSubmission(): void;
  markSubmitted(): void;
  markNumber(colour: rowColour, num: number): MarkNumberResult;
  passMove(): void;
  serialize(): SerializePlayer
}
