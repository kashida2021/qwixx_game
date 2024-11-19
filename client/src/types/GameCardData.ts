export interface GameCardData {
  rows: {
    red: number[];
    yellow: number[];
    green: number[];
    blue: number[];
  };
  isLocked: {
    red: boolean;
    yellow: boolean;
    green: boolean;
    blue: boolean;
  };
  penalties: number[];
}

export interface MoveAvailability {
  string: boolean;
}
