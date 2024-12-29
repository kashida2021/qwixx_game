import { rowColour } from "../../../enums/rowColours";
import IPlayer from "../../../models/IPlayer";
import IQwixxGameCard from "../../../models/IQwixxGameCard";
import IDice from "../../../models/IDice";

// TODO: Need player mocks where they have submitted choice and haven't submitted choice
export const player1Mock: jest.Mocked<IPlayer> = {
  get name() {
    return "Player1";
  },
  get gameCard() {
    return GameCardLockedRedRowMock;
  },
  get hasSubmittedChoice() {
    return false;
  },
  get submissionCount() {
    return 2;
  },

  resetSubmission: jest.fn(),
  markSubmitted: jest.fn(),
  markNumber: jest.fn().mockReturnValue({ success: true }),
  passMove: jest.fn(),
  serialize: jest.fn(),
};

export const player2Mock: jest.Mocked<IPlayer> = {
  get name() {
    return "Player2";
  },
  get gameCard() {
    return GameCardLockedYellowRowMock;
  },
  get hasSubmittedChoice() {
    return true;
  },
  get submissionCount() {
    return 2;
  },

  resetSubmission: jest.fn(),
  markSubmitted: jest.fn(),
  markNumber: jest.fn().mockReturnValue({ success: true }),
  passMove: jest.fn(),
  serialize: jest.fn(),
};

export const GameCardLockedRedRowMock: jest.Mocked<IQwixxGameCard> = {
  // Methods
  markNumbers: jest.fn(),
  calculateScores: jest.fn().mockReturnValue({
    penalties: 0,
    total: 48,
    subtotal: { red: 12, yellow: 12, green: 12, blue: 12 },
  }),
  lockRow: jest
    .fn()
    .mockReturnValue({ success: true, lockedRow: rowColour.Red })
    .mockReturnValue({ success: true, lockedRow: rowColour.Blue }),
  serialize: jest.fn(),
  addPenalty: jest.fn(),
  getHighestMarkedNumber: jest.fn(),
  getLowestMarkedNumber: jest.fn(),
  hasAvailableMoves: jest.fn(),
  calculateSubtotalScore: jest.fn(),
  synchronizeLockedRows: jest.fn(),

  // Getters
  get MarkedNumbers() {
    return { red: [], yellow: [], green: [], blue: [] }; // Mocked RowValues
  },
  get Numbers() {
    return [1, 2, 3, 4];
  },
  get isLocked() {
    return { red: false, yellow: false, green: false, blue: false }; // Mocked RowLocks
  },
  get penalties() {
    return [];
  },
};

export const GameCardLockedYellowRowMock: jest.Mocked<IQwixxGameCard> = {
  // Methods
  markNumbers: jest.fn(),
  calculateScores: jest.fn().mockReturnValue({
    penalties: 0,
    total: 38,
    subtotal: { red: 12, yellow: 12, green: 12, blue: 0 },
  }),
  lockRow: jest
    .fn()
    .mockReturnValue({ success: true, lockedRow: rowColour.Yellow }),
  serialize: jest.fn(),
  addPenalty: jest.fn(),
  getHighestMarkedNumber: jest.fn(),
  getLowestMarkedNumber: jest.fn(),
  hasAvailableMoves: jest.fn(),
  calculateSubtotalScore: jest.fn(),
  synchronizeLockedRows: jest.fn(),

  // Getters
  get MarkedNumbers() {
    return { red: [], yellow: [], green: [], blue: [] }; // Mocked RowValues
  },
  get Numbers() {
    return [1, 2, 3, 4];
  },
  get isLocked() {
    return { red: false, yellow: false, green: false, blue: false }; // Mocked RowLocks
  },
  get penalties() {
    return [];
  },
};

export const diceMock: jest.Mocked<IDice> = {
  get diceValues() {
    return { white1: 6, white2: 6, red: 6, yellow: 6, green: 6, blue: 6 };
  },
  get whiteDiceSum() {
    return 12;
  },
  get validColouredNumbers() {
    return { red: [12, 12], yellow: [12, 12], green: [12, 12], blue: [12, 12] };
  },
  rollAllDice: jest.fn(),
  disableDie: jest.fn(),
  serialize: jest.fn(),
};
