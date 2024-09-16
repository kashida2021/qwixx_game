import { rowColour } from "../../enums/rowColours";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";

const mockGameCard: Partial<qwixxBaseGameCard> = {
  markNumbers: jest.fn(),
};

describe("Player Class tests", () => {
  it("Should take a name and be able to return it", () => {
    const testPlayer = new Player("testPlayer", mockGameCard as qwixxBaseGameCard);

    expect(testPlayer.name).toEqual("testPlayer");
  });

  test("submission count should increment when incrementSubmissionCount is called", () => {
    (mockGameCard.markNumbers! as jest.Mock).mockReturnValue(true);
   
    const testPlayer = new Player("testPlayer", mockGameCard as qwixxBaseGameCard);
    
    testPlayer.markNumber(rowColour.Red,2);
    expect(testPlayer.submissionCount).toBe(1);
  })
});
