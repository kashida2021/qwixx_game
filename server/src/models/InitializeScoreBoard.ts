class MockScoreBoard {
  private _rowArray: number[] = [];

  get row(): number[] {
    return this._rowArray;
  }
}

export const initializeScoreBoards = (
  playerNames: string[]
): MockScoreBoard[] => {
  if (playerNames.length < 2) {
    throw new Error(
      "There must be at least 2 players to generate score boards"
    );
  }

  const scoreBoards: MockScoreBoard[] = [];

  playerNames.forEach(() => {
    const scoreBoard = new MockScoreBoard();
    scoreBoards.push(scoreBoard);
  });

  return scoreBoards;
};
