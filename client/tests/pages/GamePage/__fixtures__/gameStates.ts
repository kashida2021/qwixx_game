export const initialGameState = {
  players: {
    testUser1: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
    testUser2: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
    testUser3: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
  },
  dice: {
    white1: 1,
    white2: 1,
    red: 1,
    yellow: 1,
    green: 1,
    blue: 1,
  },
  activePlayer: "testUser1",
  hasRolled: false,
};

export const hasRolledGameState = {
  players: {
    testUser1: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
    testUser2: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
    testUser3: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
  },
  dice: {
    white1: 1,
    white2: 2,
    red: 3,
    yellow: 4,
    green: 5,
    blue: 6,
  },
  activePlayer: "testUser1",
  hasRolled: true,
};

export const user1HasSubmittedState = {
  players: {
    testUser1: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: true,
    },
    testUser2: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
    testUser3: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
  },
  dice: {
    white1: 1,
    white2: 2,
    red: 3,
    yellow: 4,
    green: 5,
    blue: 6,
  },
  activePlayer: "testUser1",
  hasRolled: true,
};

export const gameEndStateLocked = {
  players: {
    testUser1: {
      gameCard: {
        rows: {
          red: [3, 5, 7, 9, 10, 12],
          yellow: [4, 8],
          green: [10, 9, 8, 6, 4, 2],
          blue: [12],
        },
        isLocked: {
          red: true,
          yellow: false,
          green: true,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: true,
    },
    testUser2: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
    testUser3: {
      gameCard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
  },
  dice: {
    white1: 1,
    white2: 2,
    red: 3,
    yellow: 4,
    green: 5,
    blue: 6,
  },
  activePlayer: "testUser1",
  hasRolled: true,
};
