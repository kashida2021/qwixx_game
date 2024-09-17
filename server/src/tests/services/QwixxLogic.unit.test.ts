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
  // gameCard: gameCardMock as qwixxBaseGameCard,
  hasSubmittedChoice: false,
  serialize: jest.fn(),
  markSubmitted: jest.fn(), 
  markNumber: jest.fn(),
};

const player2Mock: Partial<Player> = {
  name: "player2",
  // gameCard: gameCardMock as qwixxBaseGameCard,
  hasSubmittedChoice: false,
  serialize: jest.fn(),
  markSubmitted: jest.fn(),
  markNumber: jest.fn(),
};

const diceMock: Partial<Dice> = {
  rollAllDice: jest.fn(),
  serialize: jest.fn(),
};

const playersArrayMock: Player[] = [
  player1Mock as Player,
  player2Mock as Player,
];

describe("Qwixx Logic tests", () => {
  it("should call the markNumber method with correct args", () => {
    (player1Mock.markNumber as jest.Mock).mockReturnValue(true);
    
    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);
    
    testGame.rollDice();
    testGame.makeMove("player1", "red", 1);
    
    expect(player1Mock.markNumber).toHaveBeenCalledWith("red", 2);
    expect(player1Mock.markNumber).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the player isn't found", () => {
    const testGame = new QwixxLogic(playersArrayMock, diceMock as Dice);
    testGame.rollDice();

    expect(() => testGame.makeMove("bad-player", "red", 2)).toThrow("Player not found");
    // const result = testGame.makeMove("", "red", 1);
    // expect(result).toBe("Player not found");
  });
});
