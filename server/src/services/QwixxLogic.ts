import Player from "../models/PlayerClass";
import Dice from "../models/DiceClass";
import { rowColour } from "../enums/rowColours";
import { SerializePlayer } from "../models/PlayerClass";
import { TDiceValues } from "../models/DiceClass";

interface rollDiceResults {
  hasRolled: boolean;
  hasAvailableMoves: boolean;
  diceValues: TDiceValues;
}

interface MoveValidationSuccess {
  isValid: true;
}

interface MoveValidationFailure {
  isValid: false;
  errorMessage: string
}

type ValidationResult = MoveValidationSuccess | MoveValidationFailure

interface SerializedGameState {
  players: Record<string, SerializePlayer>;
  dice: TDiceValues;
  activePlayer: string;
  hasRolled: boolean;
}

type MakeMoveResult =
  | { success: true; data: SerializedGameState }
  | { success: false; error: string }

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

  //TOOD make it private
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

  public makeMove(playerName: string, row: string, num: number): MakeMoveResult {
    const colourToMark = this.getColourFromRow(row);
    const player = this.playerExistsInLobby(playerName);
    // Moved this check up to here and early return
    // Only throw error here because critical error and not game-rule violation
    if (!player) {
      //return { isValid: false, errorMessage: new Error("Player not found.") };
      throw new Error("Player not found.")
    }

    //Passed the player object to validateMove instead of playerName
    const validationResult = this.validateMove(player, row, num);

    // returning an object literal because it is a game-rule violation
    if (!validationResult.isValid) {
      //throw validationResult.errorMessage;
      return { success: false, error: validationResult.errorMessage }
    }

    const markNumberResult = player.markNumber(colourToMark, num);

    // returning an object literal because it is a game-rule violation
    if (!markNumberResult.success) {
      //throw new Error("Invalid move: cannot mark this number.");
      return { success: markNumberResult.success, error: markNumberResult.errorMessage }
    }

    if (
      (player === this.activePlayer && player.submissionCount === 2) ||
      (player !== this.activePlayer && player.submissionCount === 1)
    ) {
      player.markSubmitted();
      this.processPlayersSubmission();
    }

    return { success: true, data: this.serialize() };
  }

  private validateMove(
    player: Player,
    row: string,
    num: number
  ): ValidationResult {
    const colourToMark = this.getColourFromRow(row);
    if (!this.hasRolled) {
      return {
        isValid: false,
        errorMessage: "Dice hasn't been rolled yet.",
      };
    }

    if (num < 2 || num > 12) {
      return {
        isValid: false,
        errorMessage: "Dice number is out of range.",
      };
    }

    if (player.hasSubmittedChoice) {
      return {
        isValid: false,
        errorMessage: "Player already finished their turn.",
      };
    }

    /*
     * Checks the non-active player's number selection.
     */
    if (
      player !== this.activePlayer &&
      num !== this._dice.whiteDiceSum
    ) {
      return {
        isValid: false,
        errorMessage: "Number selected doesn't equal to sum of white dice."
      };
    }

    /*
     * Checks the active player's first number selection is valid.
     * A valid move for first selection is the sum of the white dice.
     */
    if (
      player === this.activePlayer &&
      player.submissionCount === 0 &&
      num !== this._dice.whiteDiceSum
    ) {
      return {
        isValid: false,
        errorMessage: "Number selected doesn't equal to sum of white dice."
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
        errorMessage: "Number selected doesn't equal to sum of white die and coloured die."
      };
    }

    return {
      isValid: true,
    };
  }

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

    player.gameCard.addPenalty()
    player.markSubmitted();

    this.processPlayersSubmission();

    return this.serialize();
  }

  // private get players() {
  //   return this._playersArray;
  // }

  public serialize(): SerializedGameState {
    const serializedPlayers = this._playersArray.reduce((acc, player) => {
      acc[player.name] = player.serialize();
      return acc;
    }, {} as Record<string, SerializePlayer>);

    return {
      players: serializedPlayers,
      dice: this._dice.serialize(),
      activePlayer: this.activePlayer.name,
      hasRolled: this._hasRolled,
    };
  }
}
