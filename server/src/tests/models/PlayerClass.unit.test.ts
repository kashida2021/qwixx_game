import { rowColour } from "../../enums/rowColours";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";

const mockGameCard: Partial<qwixxBaseGameCard> = {
  markNumbers: jest.fn(),
  getHighestLowestMarkedNumbers: jest.fn(),
};

let testPlayer: Player;

describe("Player Class tests", () => {
  beforeEach(() => {
    testPlayer = new Player("testPlayer", mockGameCard as qwixxBaseGameCard);
  });

  it("Should take a name and be able to return it", () => {
    expect(testPlayer.name).toEqual("testPlayer");
  });

  test("submission count should increment when incrementSubmissionCount is called", () => {
    (mockGameCard.markNumbers! as jest.Mock).mockReturnValue(true);

    testPlayer.markNumber(rowColour.Red, 2);
    expect(testPlayer.submissionCount).toBe(1);
  });

  test("submission count should return to 0 after markSubmitted() call", () => {
    (mockGameCard.markNumbers! as jest.Mock).mockReturnValue(true);

    testPlayer.markNumber(rowColour.Red, 2);
    testPlayer.markNumber(rowColour.Red, 3);
    expect(testPlayer.submissionCount).toBe(2);

    testPlayer.resetSubmission();
    expect(testPlayer.submissionCount).toBe(0);
  });

  test("markSubmitted should set hasSubmittedChoice state", () => {
    expect(testPlayer.hasSubmittedChoice).toBeFalsy();

    testPlayer.markSubmitted();

    expect(testPlayer.hasSubmittedChoice).toBeTruthy();
  });

  test.only("returns true if hasAvailableMoves is true", () => {
    const obj = {
      red: 5,
      yellow: 1,
      blue: 13,
      green: 13,
    };

    const validColouredNumbers = {
      red: [7, 9],
      yellow: [3, 4],
      blue: [12, 8],
      green: [11, 5],
    };

    (mockGameCard.getHighestLowestMarkedNumbers! as jest.Mock).mockReturnValue(
      obj
    );
    const result = testPlayer.hasAvailableMoves(validColouredNumbers);
    expect(result).toBeTruthy();
  });
});
