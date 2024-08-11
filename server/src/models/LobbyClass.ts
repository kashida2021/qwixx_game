
export default class Lobby{
    private _lobbyId: string;
    private _players: string[];

    constructor(lobbyId: string){
        this._lobbyId = lobbyId;
        this._players = [];
    }

    get lobbyId(): string {
        return this._lobbyId;
      }
    
    get players(): string[] {
        return this._players;
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
        this._players = this._players.filter(playerId => playerId !== userId);
      }
    
      isFull(): boolean {
        return this._players.length >= 4;
      }
    
}