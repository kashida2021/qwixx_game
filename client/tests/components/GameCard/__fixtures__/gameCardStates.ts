import { QwixxLogic } from "../../../../src/types/qwixxLogic";
import { GameCardData } from "../../../../src/types/GameCardData";

export const gameCardBaseState: GameCardData = {
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
}

export const gameCardMarkedState: GameCardData = {
	rows: {
		red: [6],
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
};

export const gameCardTwoMarkedNumbersState: GameCardData = {
	rows: {
		red: [6, 9],
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
};

export const gameCardLockRowConditionSatisfiedState: GameCardData = {
	rows: {
		red: [2, 3, 4, 5, 6, 12],
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
};

export const gameCardPlayerLockedRowState: GameCardData = {
	rows: {
		red: [2, 3, 4, 5, 6, 12, 13],
		yellow: [],
		green: [],
		blue: [],
	},
	isLocked: {
		red: true,
		yellow: false,
		green: false,
		blue: false,
	},
	penalties: [],
};

export const gameCardOpponentLockedRowState: GameCardData = {
	rows: {
		red: [2, 3, 4, 5, 6],
		yellow: [],
		green: [],
		blue: [],
	},
	isLocked: {
		red: true,
		yellow: false,
		green: false,
		blue: false,
	},
	penalties: [],
};
