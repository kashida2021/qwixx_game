import QwixxLogic from "../../services/QwixxLogic";
import Player from "../../models/PlayerClass";
import qwixxBaseGameCard from "../../models/QwixxBaseGameCard";
import Dice from "../../models/DiceClass";
//QwixxLogic.makeMove(playerName, rowColour, num) returns {playerName:string, rowColour:string, num:int}

const gameCardMock: Partial<qwixxBaseGameCard> = {
  markNumbers: jest.fn(),
};

const player1Mock: Partial<Player> = {
  name: "player1",
  gameCard: gameCardMock as qwixxBaseGameCard,
  serialize: jest.fn(),
};

const player2Mock: Partial<Player> = {
  name: "player2",
  gameCard: gameCardMock as qwixxBaseGameCard,
  serialize: jest.fn(),
};

const diceMock: Partial<Dice> = {
  serialize: jest.fn(),
};

const playersArrayMock: Player[] = [
  player1Mock as Player,
  player2Mock as Player,
];

describe("Qwixx Logic tests", () => {
  it.skip("should make a move and return the correct result", () => {
    (gameCardMock.markNumbers! as jest.Mock).mockReturnValue(true);

    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);

    const gameState = testGame.makeMove("player1", "red", 1);
    console.log(gameState);
    // expect(gameState).toEqual({
    //   playerName: "player1",
    //   row: "red",
    //   num: 1,
    // });
    expect(gameCardMock.markNumbers).toHaveBeenCalledWith("red", 1);

    const player2result = testGame.makeMove("player2", "blue", 1);
    // expect(player2result).toEqual({
    //   playerName: "player2",
    //   row: "blue",
    //   num: 1,
    // });
    expect(gameCardMock.markNumbers).toHaveBeenCalledWith("blue", 1);
  });

  it("should return a message if the player isn't found", () => {
    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);
    const result = testGame.makeMove("", "red", 1);
    expect(result).toBe("Player not found");
  });
});
