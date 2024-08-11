import Lobby from "../../models/LobbyClass";

describe("Lobby Class tests", () => {
  it("Should take a lobbyId and be able to return it", () => {
    const testLobby = new Lobby("1234");

    expect(testLobby.lobbyId).toEqual("1234");
  });

  it("should be able to add new players to the lobby", () => {
    const testLobby = new Lobby("1234");
    testLobby.addPlayer("John");

    expect(testLobby.players).toContain("John");
  });

  it("should be able to remove players from the lobby", () => {
    const testLobby = new Lobby("1234");
    testLobby.addPlayer("John");
    testLobby.addPlayer("Fred");
    testLobby.removePlayer("John");

    expect(testLobby.players).toEqual(["Fred"]);
  });
});
