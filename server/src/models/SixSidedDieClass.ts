import IDie from "./IDie";

export default class SixSidedDie implements IDie {
  private _value: number;
  private _active: boolean;

  constructor() {
    this._value = 1;
    this._active = true;
  }

  get value(): number {
    return this._value;
  }

  rollDie(): number {
    this._value = Math.floor(Math.random() * 6) + 1;
    return this._value;
  }

  get active(): boolean {
    return this._active;
  }

  disable(): void {
    this._active = false;
  }
}
