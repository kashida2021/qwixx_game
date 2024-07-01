import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";

const mockGameCard: Partial<qwixxBaseGameCard> = {
};

describe("Player Class tests", () => {
  it("Should take a name and be able to return it", () => {
    const testPlayer = new Player("testPlayer", mockGameCard as qwixxBaseGameCard);

    expect(testPlayer.name).toEqual("testPlayer");
  });

  it("Should take a score card in its constructor and be able to return it", () => {
    const testPlayer = new Player("testPlayer", mockGameCard as qwixxBaseGameCard);
    console.log(testPlayer.gameCard)
    expect(testPlayer.gameCard).toEqual(mockGameCard);
  });
});
