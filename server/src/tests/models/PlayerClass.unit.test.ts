import { rowColour } from "../../enums/rowColours";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";

const mockGameCard: Partial<qwixxBaseGameCard> = {
  markNumbers: jest.fn(),
};

let testPlayer: Player;

describe("Player Class tests", () => {
  beforeEach(() => {
    testPlayer = new Player("testPlayer", mockGameCard as qwixxBaseGameCard);
  });

  it("Should take a name and be able to return it", () => {
    expect(testPlayer.name).toEqual("testPlayer");
  });

  test("submission count should increment when marking a number is successful", () => {
    (mockGameCard.markNumbers! as jest.Mock).mockReturnValue({ success: true });

    testPlayer.markNumber(rowColour.Red, 2);
    expect(testPlayer.submissionCount).toBe(1);
  });

  test("should return an error message when marking a number is unsuccessful", () => {
    (mockGameCard.markNumbers! as jest.Mock).mockReturnValue({
      success: false,
      errorMessage: "Invalid move."
    });

    const res = testPlayer.markNumber(rowColour.Red, 2);
    expect(res).toEqual({ success: false, errorMessage: "Invalid move." })
  })

  test("submission count should return to 0 after markSubmitted() call", () => {
    (mockGameCard.markNumbers! as jest.Mock).mockReturnValue({ success: true });

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
});
