import QwixxLogic from "../../services/QwixxLogic";

//QwixxLogic.makeMove(playerName, rowColour, num) returns {playerName:string, rowColour:string, num:int}

const player1Mock = {
  name: "player1",
  scoreCard: {
    tickNumber: jest.fn(),
  },
};

const player2Mock = {
  name: "player2",
  scoreCard: {
    tickNumber: jest.fn(),
  },
};

const playersArrayMock = [player1Mock, player2Mock];
const diceMock = {};

describe("Qwixx Logic tests", () => {
  it("should make a move and return the correct result", () => {
    player1Mock.scoreCard.tickNumber.mockReturnValue(true);
    player2Mock.scoreCard.tickNumber.mockReturnValue(true);

    const testGame = new QwixxLogic(playersArrayMock, diceMock);

    const player1result = testGame.makeMove("player1", "red", 1);
    expect(player1result).toEqual({
      playerName: "player1",
      rowColour: "red",
      num: 1,
    });

    const player2result = testGame.makeMove("player2", "red", 1);
    expect(player2result).toEqual({
      playerName: "player2",
      rowColour: "red",
      num: 1,
    });
  });

  it("should return a message if the player isn't found", () => {
    const testGame = new QwixxLogic(playersArrayMock, diceMock);
    const result = testGame.makeMove("", "red", 1);
    expect(result).toBe("Player not found");
  });
});
