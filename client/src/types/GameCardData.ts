export interface GameCardData {
  red: number[];
  yellow: number[];
  green: number[];
  blue: number[];
  isLocked: {
    red: boolean;
    yellow: boolean;
    green: boolean;
    blue: boolean;
  };
  penalties: number;
}
