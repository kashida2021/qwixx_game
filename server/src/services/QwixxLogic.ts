import Player from "../models/PlayerClass";
import Dice from "../models/DiceClass";
import { rowColour } from "../enums/rowColours";

export default class QwixxLogic {
  private _playersArray: Player[];
  private _dice: Dice;

  constructor(players: Player[], dice: Dice) {
    this._playersArray = players;
    this._dice = dice;
  }

  rollDice() {
    return this._dice.rollAllDice();
  };

  makeMove(playerName: string, row: string, num: number) {
    let colourToMark: rowColour;
    switch (row.toLowerCase()) {
      case "red":
        colourToMark = rowColour.Red;
        break;
      case "yellow":
        colourToMark = rowColour.Yellow;
        break;
      case "green":
        colourToMark = rowColour.Green;
        break;
      case "blue":
        colourToMark = rowColour.Blue;
        break;
      default:
        throw new Error("Invalid colour");
    }

    for (const player of this._playersArray) {
      if (player.name === playerName) {
        // console.log(playerName);
        if (player.gameCard.markNumbers(colourToMark, num)) {
          // Only returning the event data.
          // Might need to refactor later if should send back a complete state of a player's scoreboard.
         // return { playerName, row, num };
         return this.serialize();
        }
      }
    }
    return "Player not found";
  }

  get players() {
    return this._playersArray;
  }

  serialize() {
    const serializedPlayers = this._playersArray.reduce((acc, player) => {
      acc[player.name] = player.serialize();
      return acc;
    }, {} as Record<string, any>);

    return {
      players: serializedPlayers,
      dice: this._dice.serialize(),
    };
  }
}
