export interface QwixxLogic {
  players: {
    [name: string]: {
      gameCard: {
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
      };
      hasSubmittedChoice: boolean;
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
  activePlayer: string;
  hasRolled: boolean;
}
