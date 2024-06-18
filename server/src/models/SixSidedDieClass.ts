export default class SixSidedDie {
  private _value: number;
  private _active: boolean;

  constructor() {
    this._value = 1;
    this._active = true;
  }

  get value(): number {
    return this._value;
  }

  rollDie(): void {
    this._value = Math.floor(Math.random() * 6) + 1;
  }

  get active(): boolean {
    return this._active;
  }

  disable(): void {
    this._active = false;
  }
}
