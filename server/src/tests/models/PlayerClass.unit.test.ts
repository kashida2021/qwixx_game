import Player from "../../models/PlayerClass";
import GameBoard from "../../models/GameBoardTemp";

const mockGameCard: Partial<GameBoard> = {
};

describe("Player Class tests", () => {
  it("Should take a name and be able to return it", () => {
    const testPlayer = new Player("testPlayer", mockGameCard as GameBoard);

    expect(testPlayer.name).toEqual("testPlayer");
  });

  it("Should take a score card in its constructor and be able to return it", () => {
    const testPlayer = new Player("testPlayer", mockGameCard as GameBoard);
    console.log(testPlayer.gameCard)
    expect(testPlayer.gameCard).toEqual(mockGameCard);
  });
});
