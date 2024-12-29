import { rowColour } from "../enums/rowColours";
import { SerializePlayer } from "../models/PlayerClass";
import { TDiceValues } from "../models/DiceClass";
import { DiceColour } from "../enums/DiceColours";
import IPlayer from "../models/IPlayer";
import IDice from "../models/IDice";
import IQwixxLogic from "./IQwixxLogic";

export interface RollDiceResult {
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
type ErrorResult = { success: false; errorMessage: string };

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

export interface SerializedGameState {
  players: Record<string, SerializePlayer>;
  dice: TDiceValues;
  activePlayer: string;
  hasRolled: boolean;
}

export type PassMoveResult =
  | { success: true; data: SerializedGameState }
  | ErrorResult;

type GameActionResult =
  | { success: true; gameEnd: false; data: SerializedGameState }
  | { success: true; gameEnd: true; data: EndGameSummary }
  | ErrorResult;

export type MakeMoveResult = GameActionResult;
export type ProcessPenaltyResult = GameActionResult;
export type EndTurnResult = GameActionResult;

export type LockRowResult =
  | { success: true; data: SerializedGameState }
  | ErrorResult;

export default class QwixxLogic implements IQwixxLogic {
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

  public rollDice(): RollDiceResult {
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

  private playerExistsInLobby(playerName: string): IPlayer {
    const player = this._playersArray.find(
      (player) => player.name === playerName
    );

    if (!player) {
      throw new Error("Player not found.");
    }

    return player;
  }

  private get hasRolled() {
    return this._hasRolled;
  }

  private validateGameActionPrerequisite(player: IPlayer): ValidationResult {
    if (!this.hasRolled) {
      return { isValid: false, errorMessage: "Dice hasn't been rolled yet." };
    }

    if (player.hasSubmittedChoice) {
      return {
        isValid: false,
        errorMessage: "Player already finished their turn.",
      };
    }

    return { isValid: true };
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
    const player = this.playerExistsInLobby(playerName);

    const validationResult = this.validateGameActionPrerequisite(player);

    if (!validationResult.isValid) {
      return { success: false, errorMessage: validationResult.errorMessage };
    }

    if (player !== this.activePlayer) {
      return {
        success: false,
        errorMessage: "Unable to pass if not active player.",
      };
    }

    if (player.submissionCount > 0) {
      return { success: false, errorMessage: "Cannot pass on second choice." };
    }

    player.passMove();
    return { success: true, data: this.serialize() };
  }

  public makeMove(
    playerName: string,
    row: string,
    num: number
  ): MakeMoveResult {
    const rowToMark = this.getColourFromRow(row);
    const player = this.playerExistsInLobby(playerName);

    const validPrereq = this.validateGameActionPrerequisite(player);
    if (!validPrereq.isValid) {
      return { success: false, errorMessage: validPrereq.errorMessage };
    }

    const validationResult = this.validateMove(player, rowToMark, num);
    if (!validationResult.isValid) {
      return { success: false, errorMessage: validationResult.errorMessage };
    }

    const markNumberResult = player.markNumber(rowToMark, num);
    if (!markNumberResult.success) {
      return { success: false, errorMessage: markNumberResult.errorMessage };
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
    row: rowColour,
    num: number
  ): ValidationResult {
    if (num < 2 || num > 12) {
      return {
        isValid: false,
        errorMessage: "Dice number is out of range.",
      };
    }
    //NOTE: What happens if submissionCount > 1?

    //Checks the active player's second number selection is valid.
    //A valid move for the second selection is the sum of a white die + coloured die
    if (
      player === this.activePlayer &&
      player.submissionCount === 1 &&
      !this._dice.validColouredNumbers[row]?.includes(num)
    ) {
      return {
        isValid: false,
        errorMessage:
          "Number selected doesn't equal to sum of white die and coloured die.",
      };
    }

    //General rule: All player's first mark number action needs to be the sum of the white dice.
    if (player.submissionCount === 0 && num !== this._dice.whiteDiceSum) {
      return {
        isValid: false,
        errorMessage: "Number selected doesn't equal to sum of white dice.",
      };
    }

    return {
      isValid: true,
    };
  }

  public endTurn(playerName: string): EndTurnResult {
    const player = this.playerExistsInLobby(playerName);
    const validationResult = this.validateGameActionPrerequisite(player);

    if (!validationResult.isValid) {
      return { success: false, errorMessage: validationResult.errorMessage };
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

  public processPenalty(playerName: string): ProcessPenaltyResult {
    const player = this.playerExistsInLobby(playerName);
    const validationResult = this.validateGameActionPrerequisite(player);

    if (!validationResult.isValid) {
      return { success: false, errorMessage: validationResult.errorMessage };
    }

    player.gameCard.addPenalty();
    player.markSubmitted();
    const res = this.processPlayersSubmission();

    if (res.hasGameEnded) {
      return { success: true, gameEnd: res.hasGameEnded, data: res.data };
    }
    return { success: true, gameEnd: res.hasGameEnded, data: this.serialize() };
  }

  public lockRow(playerName: string, row: string): LockRowResult {
    const colourToLock = this.getColourFromRow(row);
    const player = this.playerExistsInLobby(playerName);

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
