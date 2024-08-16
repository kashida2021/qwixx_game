import Player from "../models/PlayerClass";
import Dice from "../models/DiceClass";
import QwixxLogic from "../services/QwixxLogic";
import { initializeGameCards } from "./InitializeGameCards";
import { initializePlayers } from "./InitializePlayer";
import SixSidedDie from "./SixSidedDieClass";

export default class Lobby {
  private _lobbyId: string;
  private _players: string[];
  private _playerObjects: Player[];
  private _gameLogic: QwixxLogic | null;

  constructor(lobbyId: string) {
    this._lobbyId = lobbyId;
    this._players = [];
    this._playerObjects = [];
    this._gameLogic = null;
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

  get gameLogic(): QwixxLogic | null {
    return this._gameLogic;
  }

  addPlayer(userId: string): boolean {
    if (this._players.length < 4) {
      this._players.push(userId);
      return true;
    } else {
      return false; // Lobby is full
    }
  }

  removePlayer(userId: string): void {
    this._players = this._players.filter((playerId) => playerId !== userId);
  }

  startGame() {
    const gameCards = initializeGameCards(this._players);
    this._playerObjects = initializePlayers(this._players, gameCards);
    const dice = new Dice(SixSidedDie);
    this._gameLogic = new QwixxLogic(this._playerObjects, dice);
  }

  isFull(): boolean {
    return this._players.length >= 4;
  }
}
