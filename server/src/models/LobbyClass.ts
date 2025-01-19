import Player from "../models/PlayerClass";
import Dice from "../models/DiceClass";
import QwixxLogic from "../services/QwixxLogic";
import { initializeGameCards } from "./InitializeGameCards";
import { initializePlayers } from "./InitializePlayer";
import { DiceColour } from "../enums/DiceColours";
import IQwixxLogic from "../services/IQwixxLogic";
import initializeDice from "./InitializeDice";

interface SerializedGameState {
  players: Record<string, any>;
  dice: Record<DiceColour, number>;
  activePlayer: string;
}

interface playersReadinessInLobby {
  [userId: string]: boolean;
}
export default class Lobby {
  private _lobbyId: string;
  private _players: string[];
  private _playerObjects: Player[];
  private _gameLogic: IQwixxLogic | null;
  private _playersReadinessInLobby: playersReadinessInLobby = {};

  constructor(lobbyId: string) {
    this._lobbyId = lobbyId;
    this._players = [];
    this._playerObjects = [];
    this._gameLogic = null;
    this._playersReadinessInLobby = {};
  }

  get lobbyId(): string {
    return this._lobbyId;
  }

  get players(): string[] {
    return this._players;
  }

  get playerObjects(): Player[] {
    return this._playerObjects;
  }

  get gameLogic(): IQwixxLogic | null {
    return this._gameLogic;
  }

  get serializedGameLogic(): SerializedGameState | undefined {
    return this._gameLogic?.serialize();
  }

  addPlayer(userId: string): boolean {
    if (this._players.length < 4) {
      this._players.push(userId);
      this._playersReadinessInLobby[userId] = false;
      return true;
    } else {
      return false; // Lobby is full
    }
  }

  removePlayer(userId: string): void {
    this._players = this._players.filter((playerId) => playerId !== userId);
    delete this._playersReadinessInLobby[userId];
  }

  startGame() {
    const gameCards = initializeGameCards(this._players);
    this._playerObjects = initializePlayers(this._players, gameCards);
    const sixSidedDice = initializeDice();
    const dice = new Dice(sixSidedDice);
    this._gameLogic = new QwixxLogic(this._playerObjects, dice);

    return this._gameLogic.serialize();
  }

  isFull(): boolean {
    return this._players.length >= 4;
  }

  markPlayerReady(userId: string) {
    if (userId in this._playersReadinessInLobby) {
      this._playersReadinessInLobby[userId] = true;
    }
  }

  resetGameState() {
    this._gameLogic = null;
    this._playerObjects = [];

    for (const userId in this._playersReadinessInLobby) {
      this._playersReadinessInLobby[userId] = false;
    }
  }
}
