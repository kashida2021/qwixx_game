import Player from "../../models/PlayerClass";

const mockScoreCard = {
  redRow: [1, 3, 5, 6],
};

describe("Player Class tests", () => {
  it("Should take a name and be able to return it", () => {
    const testPlayer = new Player("testPlayer", mockScoreCard);

    expect(testPlayer.name).toEqual("testPlayer");
  });

  it("Should take a score card in its constructor and be able to return it", () => {
    const testPlayer = new Player("testPlayer", mockScoreCard);

    expect(testPlayer.scoreCard).toEqual(mockScoreCard);
  });
});
