import QwixxLogic from "../../services/QwixxLogic";
import GameBoard from "../../models/GameBoardTemp";
import Player from "../../models/PlayerClass";
import SixSidedDie from "../../models/SixSidedDieClass";
import Dice from "../../models/DiceClass";
import { rowColour } from "../../enums/rowColours";

let mockPlayersArray: Player[];
let mockDice: Dice;

describe("Qwixx Logic integration tests:", () => {
  beforeEach(() => {
    const mockScoreCard1 = new GameBoard();
    const mockPlayer1 = new Player("test-player1", mockScoreCard1);

    const mockScoreCard2 = new GameBoard();
    const mockPlayer2 = new Player("test-player2", mockScoreCard2);

    mockDice = new Dice(SixSidedDie);

    mockPlayersArray = [mockPlayer1, mockPlayer2];
  });
  it("should return all players", () => {
    const testGame = new QwixxLogic(mockPlayersArray, mockDice);

    expect(testGame.players.length).toBe(2);
    testGame.players.forEach((player) => {
      expect(player.scoreCard instanceof GameBoard).toBe(true);
    });
  });

  it("should make a move and return the correct result", () => {
    const testGame = new QwixxLogic(mockPlayersArray, mockDice);

    const mockPlayer1MoveResult = testGame.makeMove("test-player1", "red", 1);
    expect(mockPlayer1MoveResult).toEqual({
      playerName: "test-player1",
      row: "red",
      num: 1,
    });

    const mockPlayer2MoveResult = testGame.makeMove(
      "test-player2",
      "yellow",
      1
    );
    expect(mockPlayer2MoveResult).toEqual({
      playerName: "test-player2",
      row: "yellow",
      num: 1,
    });
  });

  it("should return a message if the player isn't found when making a move", () => {
    const testGame = new QwixxLogic(mockPlayersArray, mockDice);

    const nonPlayerResult = testGame.makeMove("test-player3", "red", 1);
    expect(nonPlayerResult).toBe("Player not found");
  });

  it("should throw an error if colour doesn't exist in rowColour enum", () => {
    const testGame = new QwixxLogic(mockPlayersArray, mockDice);

    expect(() => {
      testGame.makeMove("test-player1", "orange", 1);
    }).toThrow("Invalid colour");
  });
});
