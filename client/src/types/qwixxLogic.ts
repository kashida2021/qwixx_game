export interface QwixxLogic {
  players: {
    [name: string]: {
      rows: {
        Red: number[];
        Yellow: number[];
        Green: number[];
        Blue: number[];
      };
      isLocked: {
        Red: boolean;
        Yellow: boolean;
        Green: boolean;
        Blue: boolean;
      };
      penalties: number;
    };
  };
  dice: {
    White1: number;
    White2: number;
    Red: number;
    Yellow: number;
    Green: number;
    Blue: number;
  };
}
