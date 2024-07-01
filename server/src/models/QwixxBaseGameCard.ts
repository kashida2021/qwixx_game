import { rowColour } from "../enums/rowColours";

export default class qwixxBaseGameCard {
  private _rows: { [key in rowColour]: number[] };
  private _numbers: number[];
  private _lockedRows: string[];
  private _penalties: number[];

  constructor() {
    this._rows = {
      [rowColour.Red]: [],
      [rowColour.Yellow]: [],
      [rowColour.Green]: [],
      [rowColour.Blue]: [],
    };

    this._numbers = Array.from({ length: 12 }, (_, i) => i + 2);

    this._lockedRows = [];

    this._penalties = [];
  }

  serialize() {
    return {
      gameCard: this._rows,
      numbers: this._numbers,
      lockedRows: this._lockedRows,
      penalties: this._penalties,
    };
  }

  static from(data: any): qwixxBaseGameCard {
    const gameCard = new qwixxBaseGameCard();
    gameCard._rows = data.gameCard;
    gameCard._numbers = data.numbers;
    gameCard._lockedRows = data.lockedRows;
    gameCard._penalties = data.penalties;
    return gameCard;
  }

  get MarkedNumbers() {
    return this._rows;
  }

  get Numbers() {
    return this._numbers;
  }

  markNumbers(row: rowColour, number: number) {
    if (!this._rows[row].includes(number)) {
      this._rows[row].push(number);
      return true
    }else{
      return false
    }
  }

  getLockedRows() {
    return this._lockedRows;
  }

  getPenalties() {
    return this._penalties;
  }
}
