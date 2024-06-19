export default class QwixxLogic {
  private _playersArray: any[];
  private _dice: any;

  constructor(players: any, dice: any) {
    this._playersArray = players;
    this._dice = dice;
  }

  makeMove(playerName: string, rowColour: string, num: number) {
    for (const player of this._playersArray) {
      if (player.name === playerName) {
        console.log(playerName);
        if (player.scoreCard.tickNumber(rowColour, num)) {
          //Only returning the event data.
          // Might need to refactor later if should send back a complete state of a player's scoreboard.
          return { playerName, rowColour, num };
        }
      }
    }
    return "Player not found";
  }

  get players(){
    return this._playersArray; 
  }
}
