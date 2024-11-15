import Player from "../models/PlayerClass";
import Dice from "../models/DiceClass";
import { rowColour } from "../enums/rowColours";
import { DiceColour } from "../enums/DiceColours";

interface ValidationResult {
  isValid: boolean;
  errorMessage: Error | null;
}

interface rollDiceResults {
  hasRolled: boolean;
  hasAvailableMoves: boolean;
  diceValues: Record<DiceColour, number>;
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

  public rollDice(): rollDiceResults {
    this._hasRolled = true;
    const hasRolled = this.hasRolled;
    const validColouredNumbers = this._dice.validColouredNumbers;
    const hasAvailableMoves =
      this.activePlayer.gameCard.hasAvailableMoves(validColouredNumbers);

    return {
      hasRolled,
      hasAvailableMoves,
      diceValues: this._dice.rollAllDice(),
    };
  }

  private get activePlayer() {
    return this._playersArray[this._currentTurnIndex];
  }

  private playerExistsInLobby(playerName: string): Player | undefined {
    return this._playersArray.find((player) => player.name === playerName);
  }

  public get hasRolled() {
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

    const player = this.playerExistsInLobby(playerName);

    if (player) {
      const markSuccess = player.markNumber(colourToMark, num);
      if (!markSuccess) {
        throw new Error("Invalid move: cannot mark this number.");
      }

      if (
        (player === this.activePlayer && player.submissionCount === 2) ||
        (player !== this.activePlayer && player.submissionCount === 1)
      ) {
        player.markSubmitted();
        this.processPlayersSubmission();
      }
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

    const player = this.playerExistsInLobby(playerName);

    if (!player) {
      return { isValid: false, errorMessage: new Error("Player not found.") };
    }

    if (player.hasSubmittedChoice) {
      return {
        isValid: false,
        errorMessage: new Error("Player already finished their turn."),
      };
    }

    const highestMarkedNumber =
      player.gameCard.getHighestMarkedNumber(colourToMark);
    const lowestMarkedNumber =
      player.gameCard.getLowestMarkedNumber(colourToMark);

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

    /*add check for number being lower or higher than last checked number */
    if (colourToMark === "red" || colourToMark === "yellow") {
      if (num <= highestMarkedNumber) {
        return {
          isValid: false,
          errorMessage: new Error(
            "Number must be above the last marked number"
          ),
        };
      }
    } else if (colourToMark === "green" || colourToMark === "blue") {
      if (num >= lowestMarkedNumber) {
        return {
          isValid: false,
          errorMessage: new Error(
            "Number must be below the last marked number"
          ),
        };
      }
    }

    return {
      isValid: true,
      errorMessage: null,
    };
  }

  //public validMoveAvailable(): Record<string, boolean> {
  //const playerMoveAvailable: Record<string, boolean> = {};

  //for (const player of this._playersArray) {
  //let hasValidMove = false;

  //for (let row of ["red", "yellow", "green", "blue"]) {
  // for (let num = 2; num <= 12; num++) {
  // const validationResult = this.validMove(player.name, row, num);
  //if (validationResult.isValid) {
  //           hasValidMove = true;
  //           break;
  //         }
  //       }
  //       if (hasValidMove) break;
  //     }
  //     playerMoveAvailable[player.name] = hasValidMove;
  //   }
  //   return playerMoveAvailable;
  // }

  public endTurn(playerName: string) {
    const player = this.playerExistsInLobby(playerName);

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

  public processPenalty(playerName: string) {
    const player = this.playerExistsInLobby(playerName);
    if (!player) {
      throw new Error("Player not found");
    }

    player.addPenalty();
    player.markSubmitted();

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
      hasRolled: this._hasRolled,
    };
  }
}
