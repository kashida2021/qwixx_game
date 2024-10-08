export interface QwixxLogic {
  players: {
    [name: string]: {
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
      penalties: number;
    };
  };
  dice: {
    white1: number;
    white2: number;
    red: number;
    yellow: number;
    green: number;
    blue: number;
  };
}
