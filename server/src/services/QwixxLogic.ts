import { rowColour } from "../enums/rowColours";
import { SerializePlayer } from "../models/PlayerClass";
import { TDiceValues } from "../models/DiceClass";
import { DiceColour } from "../enums/DiceColours";
import IPlayer from "../models/IPlayer";
import IDice from "../models/IDice";

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
  errorMessage: string;
}

interface EndGameSummary {
  winners: string[];
  scores: {
    subtotal: Record<string, number>;
    penalties: number;
    total: number;
    name: string;
  }[];
}

// type SuccessResult<T> = { success: true; data: T};
type ErrorResult = { success: false; errorMessage: string};

interface GameHasEnded {
  hasGameEnded: true;
  data: EndGameSummary;
}

interface GameOngoing {
  hasGameEnded: false;
  data: null;
}

type ValidationResult = MoveValidationSuccess | MoveValidationFailure;
type ProcessPlayerSubmissionResult = GameHasEnded | GameOngoing;

interface SerializedGameState {
  players: Record<string, SerializePlayer>;
  dice: TDiceValues;
  activePlayer: string;
  hasRolled: boolean;
}

type PassMoveResult =
  | { success: true; data: SerializedGameState }
  | ErrorResult;

type GameActionResult = 
  | { success: true; gameEnd: false; data: SerializedGameState} 
  | { success: true; gameEnd: true; data: EndGameSummary}
  | ErrorResult

type MakeMoveResult = GameActionResult
type ProcessPenaltyResult = GameActionResult
type EndTurnResult = GameActionResult

type LockRowResult =
  | { success: true; data: SerializedGameState }
  | ErrorResult


export default class QwixxLogic {
  private _playersArray: IPlayer[];
  private _dice: IDice;
  private _currentTurnIndex: number;
  private _hasRolled: boolean;
  private _lockedRows: rowColour[];

  constructor(players: IPlayer[], dice: IDice) {
    this._playersArray = players;
    this._dice = dice;
    this._currentTurnIndex = 0;
    this._hasRolled = false;
    this._lockedRows = [];
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

  private playerExistsInLobby(playerName: string): IPlayer | undefined {
    return this._playersArray.find((player) => player.name === playerName);
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

  private normaliseLockedRows() {
    this._playersArray.forEach((player) =>
      player.gameCard.synchronizeLockedRows(this._lockedRows)
    );
  }

  private isGameEnd() {
    return (
      this._lockedRows.length >= 2 ||
      this._playersArray.some((p) => p.gameCard.penalties.length === 4)
    );
  }

  private handleEndOfRound() {
    this.resetAllPlayersSubmission();

    if (this._lockedRows) {
      this.normaliseLockedRows();
      this._lockedRows.forEach((row) => {
        const diceColour = this.getDiceColourFromLockedRow(row);
        this._dice.disableDie(diceColour);
      });
    }
  }

  private processPlayersSubmission(): ProcessPlayerSubmissionResult {
    if (this.haveAllPlayersSubmitted()) {
      this.handleEndOfRound();

      if (this.isGameEnd()) {
        const winners = this.determineWinner();
        return { hasGameEnded: true, data: winners };
      }

      this.nextTurn();
    }
    return { hasGameEnded: false, data: null };
  }

  private getDiceColourFromLockedRow(row: rowColour): DiceColour {
    switch (row) {
      case rowColour.Red:
        return DiceColour.Red;
      case rowColour.Yellow:
        return DiceColour.Yellow;
      case rowColour.Green:
        return DiceColour.Green;
      case rowColour.Blue:
        return DiceColour.Blue;
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

  public passMove(playerName: string): PassMoveResult {
    // Call Player Method add submission to player
    const player = this.playerExistsInLobby(playerName);

    if (!player) {
      throw new Error("Player not found.");
    }

    if (!this.hasRolled) {
      return { success: false, errorMessage: "Dice hasn't been rolled yet." };
    }
    // Check if active player
    if (player !== this.activePlayer) {
      return {
        success: false,
        errorMessage: "Unable to pass if not active player.",
      };
    }

    // Check submission count is 0
    if (player?.submissionCount === 1) {
      return { success: false, errorMessage: "Cannot pass on second choice." };
    }

    //add player method to update submission count for passmove
    player.passMove();
    return { success: true, data: this.serialize() };
  }

  public makeMove(
    playerName: string,
    row: string,
    num: number
  ): MakeMoveResult {
    const colourToMark = this.getColourFromRow(row);
    const player = this.playerExistsInLobby(playerName);
    // Moved this check up to here and early return
    // Only throw error here because critical error and not game-rule violation
    if (!player) {
      //return { isValid: false, errorMessage: new Error("Player not found.") };
      throw new Error("Player not found.");
    }

    //Passed the player object to validateMove instead of playerName
    const validationResult = this.validateMove(player, row, num);

    // returning an object literal because it is a game-rule violation
    if (!validationResult.isValid) {
      //throw validationResult.errorMessage;
      return { success: false, errorMessage: validationResult.errorMessage };
    }

    const markNumberResult = player.markNumber(colourToMark, num);

    // returning an object literal because it is a game-rule violation
    if (!markNumberResult.success) {
      //throw new Error("Invalid move: cannot mark this number.");
      return {
        success: markNumberResult.success,
        errorMessage: markNumberResult.errorMessage,
      };
    }

    if (
      (player === this.activePlayer && player.submissionCount === 2) ||
      (player !== this.activePlayer && player.submissionCount === 1)
    ) {
      player.markSubmitted();
    }

    const res = this.processPlayersSubmission();
    if (res.hasGameEnded) {
      return { success: true, gameEnd: res.hasGameEnded, data: res.data };
    } else {
      return {
        success: true,
        gameEnd: res.hasGameEnded,
        data: this.serialize(),
      };
    }
  }

  private validateMove(
    player: IPlayer,
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
    if (player !== this.activePlayer && num !== this._dice.whiteDiceSum) {
      return {
        isValid: false,
        errorMessage: "Number selected doesn't equal to sum of white dice.",
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
        errorMessage: "Number selected doesn't equal to sum of white dice.",
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
        errorMessage:
          "Number selected doesn't equal to sum of white die and coloured die.",
      };
    }

    return {
      isValid: true,
    };
  }

  public endTurn(playerName: string): EndTurnResult {
    if (!this.hasRolled) {
      return { success: false, errorMessage: "Dice hasn't been rolled yet." };
    }

    const player = this.playerExistsInLobby(playerName);

    if (!player) {
      throw new Error("Player not found.");
    }

    if (player.hasSubmittedChoice) {
      return {
        success: false,
        errorMessage: "Player has already ended their turn.",
      };
    }

    if (player !== this.activePlayer) {
      player.markSubmitted();
    }

    if (player === this.activePlayer) {
      if (player.submissionCount === 0) {
        player.gameCard.addPenalty();
      }
      player.markSubmitted();
    }

    const res = this.processPlayersSubmission();

    if (res.hasGameEnded) {
      return { success: true, gameEnd: res.hasGameEnded, data: res.data };
    }

    return { success: true, gameEnd: false, data: this.serialize() };
  }

  public processPenalty(playerName: string) {
    const player = this.playerExistsInLobby(playerName);
    if (!player) {
      throw new Error("Player not found");
    }

    player.gameCard.addPenalty();
    player.markSubmitted();
    this.processPlayersSubmission();

    return this.serialize();
  }

  public lockRow(playerName: string, row: string): LockRowResult {
    const colourToLock = this.getColourFromRow(row);

    const player = this.playerExistsInLobby(playerName);
    if (!player) {
      throw new Error("Player not found");
    }

    const res = player.gameCard.lockRow(colourToLock);

    if (!res.success && res.errorMessage) {
      return { success: false, errorMessage: res.errorMessage };
    }
    // NOTE:
    //Does having this result in any bugs?
    if (
      res.success &&
      res.lockedRow &&
      !this._lockedRows.includes(res.lockedRow)
    ) {
      this._lockedRows.push(res.lockedRow);
    }

    return { success: true, data: this.serialize() };
  }
  // private get players() {
  //   return this._playersArray;
  // }

  public collectPlayersScores() {
    const playerScores = this._playersArray.map((player) => ({
      name: player.name,
      ...player.gameCard.calculateScores(),
    }));

    return playerScores;
  }

  public determineWinner(): EndGameSummary {
    const playerScores = this.collectPlayersScores();
    const highestScore = Math.max(
      ...playerScores.map((player) => player.total)
    );
    const winners = playerScores
      .filter((player) => player.total === highestScore)
      .map((player) => player.name);

    return { winners, scores: playerScores };
  }

  public serialize(): SerializedGameState {
    const serializedPlayers = this._playersArray.reduce((acc, player) => {
      acc[player.name] = player.serialize();
      return acc;
    }, {} as Record<string, SerializePlayer>);

    // NOTE:
    // We aren't returning the lockedRow state from this class, but we are getting locked rows from Player class
    // The frontend code is built with that in mind but would including _lockedRows from this class make it more efficient?
    return {
      players: serializedPlayers,
      dice: this._dice.serialize(),
      activePlayer: this.activePlayer.name,
      hasRolled: this._hasRolled,
    };
  }
}
