import QwixxLogic from "../../services/QwixxLogic";
import {
  GameCardLockedRedRowMock,
  GameCardLockedYellowRowMock,
  player1Mock,
  player2Mock,
  diceMock,
} from "../models/__mocks__/MockedInterfaces";

describe.skip("Game Actions", () => {
  it("should call the markNumber method with correct args", () => {
    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);
    testGame.rollDice();
    testGame.makeMove("Player1", "red", 10);

    expect(player1Mock.markNumber).toHaveBeenCalledWith("red", 10);
    expect(player1Mock.markNumber).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the player isn't found", () => {
    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);
    testGame.rollDice();

    expect(() => testGame.makeMove("bad-player", "red", 2)).toThrow(
      "Player not found"
    );
  });

  test("non-active player marking a number that doesn't equal the sum of white dice should return error object", () => {
    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);

    testGame.rollDice();

    const res = testGame.makeMove("Player1", "red", 9);
    if (!res.success) {
      expect(res.success).toBeFalsy();
      expect(res.errorMessage).toEqual(
        "Number selected doesn't equal to sum of white dice."
      );
    }
  });

  test.only("non-active player can mark a number equal to the sum of the white dice", () => {
    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);

    testGame.rollDice();
    testGame.makeMove("Player2", "red", 10);

    expect(player2Mock.markNumber).toHaveBeenCalledWith("red", 10);
    expect(player2Mock.markNumber).toHaveBeenCalledTimes(1);
  });
});
describe("Game end:", () => {
  it("Can determine the game has ended when 2 rows are locked", () => {
    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);
    testGame.rollDice();

    testGame.lockRow("Player1", "red");
    testGame.lockRow("Player2", "yellow");

    jest
      .spyOn(player1Mock, "hasSubmittedChoice", "get")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    const res = testGame.endTurn("Player1");

    if (!res.success || !res.gameEnd) {
      throw new Error("Result is not a game-end state");
    }

    expect(res.data.winners).toEqual(["Player1"]);
  });

  it("Can determine the game has ended when more than 2 rows are locked", () => {
    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);
    testGame.rollDice();

    testGame.lockRow("Player1", "red");
    testGame.lockRow("Player2", "yellow");

    jest
      .spyOn(player1Mock, "hasSubmittedChoice", "get")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    const res = testGame.endTurn("Player1");

    if (!res.success || !res.gameEnd) {
      throw new Error("Result is not a game-end state");
    }

    expect(res.data.winners).toEqual(["Player1"]);
  });

  it("Can determine the game has ended when a player has 4 penalties", () => {
    jest
      .spyOn(GameCardLockedRedRowMock, "penalties", "get")
      .mockReturnValueOnce([1, 2, 3, 4]);

    jest
      .spyOn(player1Mock, "hasSubmittedChoice", "get")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);
    testGame.rollDice();

    const res = testGame.processPenalty("Player1");

    if (!res.success || !res.gameEnd) {
      throw new Error("Result is not a game-end state");
    }

    expect(res.data.winners).toEqual(["Player1"]);
  });

  it("Can determine the game hasn't ended if at least 2 rows aren't locked", () => {
    jest
      .spyOn(player1Mock, "hasSubmittedChoice", "get")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);
    testGame.rollDice();

    testGame.lockRow("Player1", "red");
    const res = testGame.endTurn("Player1");

    if (!res.success || res.gameEnd) {
      throw new Error("Result is not successful");
    }

    expect(res.success).toBeTruthy();
    expect(res.gameEnd).toBeFalsy();
    expect(res.data.hasRolled).toBeFalsy();
  });

  it("Can determine the game hasn't ended if 4 penalties haven't been accrued by a player", () => {
    jest
      .spyOn(GameCardLockedRedRowMock, "penalties", "get")
      .mockReturnValueOnce([1]);

    jest
      .spyOn(player1Mock, "hasSubmittedChoice", "get")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const testGame = new QwixxLogic([player1Mock, player2Mock], diceMock);
    testGame.rollDice();

    const res = testGame.processPenalty("Player1");

    if (!res.success || res.gameEnd) {
      throw new Error("Result is not a game-end state");
    }

    expect(res.success).toBeTruthy();
    expect(res.gameEnd).toBeFalsy();
    expect(res.data.hasRolled).toBeFalsy();
  });
});
