import Player from "../models/PlayerClass";
import Dice from "../models/DiceClass";
import { rowColour } from "../enums/rowColours";
import { DiceColour } from "../enums/DiceColours";

interface ValidationResult {
  isValid: boolean;
  errorMessage: Error | null;
}
export default class QwixxLogic {
  private _playersArray: Player[];
  private _dice: Dice;
  private _currentTurnIndex: number;
  private _hasRolled: boolean;

  constructor(players: Player[], dice: Dice) {
    this._playersArray = players;
    this._dice = dice;
    this._currentTurnIndex = 0;
    this._hasRolled = false;
  }

  public rollDice(): Record<DiceColour, number> {
    this._hasRolled = true;
    return this._dice.rollAllDice();
  }

  private get activePlayer() {
    return this._playersArray[this._currentTurnIndex];
  }

  private get hasRolled() {
    return this._hasRolled;
  }

  private nextTurn() {
    this._hasRolled = false;
    return (this._currentTurnIndex =
      (this._currentTurnIndex + 1) % this._playersArray.length);
  }

  private resetAllPlayersSubmission() {
    this._playersArray.forEach((player) => player.resetSubmission());
  }

  private haveAllPlayersSubmitted(): boolean {
    return this._playersArray.every((player) => player.hasSubmittedChoice);
  }

  private processPlayersSubmission() {
    if (this.haveAllPlayersSubmitted()) {
      this.resetAllPlayersSubmission();
      this.nextTurn();
    }
  }

  private getColourFromRow(row: string): rowColour {
    switch (row.toLowerCase()) {
      case "red":
        return rowColour.Red;
      case "yellow":
        return rowColour.Yellow;
      case "green":
        return rowColour.Green;
      case "blue":
        return rowColour.Blue;
      default:
        throw new Error("Invalid colour.");
    }
  }

  public makeMove(playerName: string, row: string, num: number) {
    const colourToMark = this.getColourFromRow(row);
    const validationResult = this.validMove(playerName, row, num);

    if (!validationResult.isValid) {
      throw validationResult.errorMessage;
    }

    const player = this._playersArray.find(
      (player) => player.name === playerName
    );

    if (player) {
      const markSuccess = player.markNumber(colourToMark, num);
      if (!markSuccess) {
        throw new Error("Invalid move: cannot mark this number.");
      }
      this.processPlayersSubmission();
    }

    return this.serialize();
  }

  public validMove(
    playerName: string,
    row: string,
    num: number
  ): ValidationResult {
    const colourToMark = this.getColourFromRow(row);
    if (!this.hasRolled) {
      return {
        isValid: false,
        errorMessage: new Error("Dice hasn't been rolled yet."),
      };
    }

    if (num < 2 || num > 12) {
      return {
        isValid: false,
        errorMessage: new Error("Dice number is out of range."),
      };
    }

    const player = this._playersArray.find(
      (player) => player.name === playerName
    );

    if (!player) {
      return { isValid: false, errorMessage: new Error("Player not found.") };
    }

    if (player.hasSubmittedChoice) {
      return {
        isValid: false,
        errorMessage: new Error("Player already finished their turn."),
      };
    }

    /*
     * Checks the non-active player's number selection.
     */
    if (
      player !== this.activePlayer &&
      num !== this._dice.diceValues.white1 + this._dice.diceValues.white2
    ) {
      return {
        isValid: false,
        errorMessage: new Error(
          "Number selected doesn't equal to sum of white dice."
        ),
      };
    }

    /*
     * Checks the active player's first number selection is valid.
     * A valid move for first selection is the sum of the white dice.
     */
    if (
      player === this.activePlayer &&
      player.submissionCount === 0 &&
      num !== this._dice.diceValues.white1 + this._dice.diceValues.white2
    ) {
      return {
        isValid: false,
        errorMessage: new Error(
          "Number selected doesn't equal to sum of white dice."
        ),
      };
    }

    /*
     * Checks the active player's second number selection is valid.
     * A valid move for the second selection is the sum of a white die + coloured die
     */
    if (
      player === this.activePlayer &&
      player.submissionCount === 1 &&
      !this._dice.validColouredNumbers[colourToMark]?.includes(num)
    ) {
      return {
        isValid: false,
        errorMessage: new Error(
          "Number selected doesn't equal to sum of white die and coloured die."
        ),
      };
    }

    if (
      (player === this.activePlayer && player.submissionCount === 2) ||
      (player !== this.activePlayer && player.submissionCount === 1)
    ) {
      return { isValid: true, errorMessage: null };
    }

    return {
      isValid: false,
      errorMessage: new Error("Unknown error or invalid game state."),
    };
  }

  public endTurn(playerName: string) {
    const player = this._playersArray.find(
      (player) => player.name === playerName
    );

    if (!player) {
      throw new Error("Player not found.");
    }

    if (player.hasSubmittedChoice) {
      throw new Error("Player already finished their turn.");
    }

    if (player !== this.activePlayer) {
      player.markSubmitted();
    }

    if (player === this.activePlayer) {
      player.markSubmitted();
    }

    this.processPlayersSubmission();

    return this.serialize();
  }

  // private get players() {
  //   return this._playersArray;
  // }

  public serialize() {
    const serializedPlayers = this._playersArray.reduce((acc, player) => {
      acc[player.name] = player.serialize();
      return acc;
    }, {} as Record<string, any>);

    return {
      players: serializedPlayers,
      dice: this._dice.serialize(),
      activePlayer: this.activePlayer.name,
    };
  }
}
