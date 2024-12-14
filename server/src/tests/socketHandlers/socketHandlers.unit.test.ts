// // Setup for this test came from socket.io website @https://socket.io/docs/v4/testing/

import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import initializeSocketHandler from "../../socketHandlers/socketHandlers";
import { generateUniqueRoomId } from "../../utils/roomUtils";
import Player from "../../models/PlayerClass";
import GameBoard from "../../models/QwixxBaseGameCard";
import QwixxLogic from "../../services/QwixxLogic";
import Dice from "../../models/DiceClass";

/*
 * Stub the return value for diceValues to avoid randomness in tests.
 * This ensures that every time diceValues is accessed, it returns a predictable set of values.
 */
jest.spyOn(Dice.prototype, "diceValues", "get").mockReturnValue({
  white1: 5,
  white2: 5,
  red: 5,
  yellow: 5,
  green: 5,
  blue: 5,
});

jest.spyOn(Dice.prototype, "whiteDiceSum", "get").mockReturnValue(10);

/*
 * Mock the generateUniqueRoomId function to return controlled values for tests.
 * This ensures that tests using this mock do not generate random values.
 */
const generateUniqueRoomIdMock = generateUniqueRoomId as jest.MockedFunction<
  typeof generateUniqueRoomId
>;

/**
 * @param {ServerSocket | ClientSocket} socket
 * @param {string} event
 * @returns {Promise<any>}
 * @description
 * We can use this utility funciton to make our test "act" more synchronous.
 * It needs to be used with async/await, otherwise it reutns a "promise pending".
 * 1st arg is the socket listening for the event.
 * 2nd arg is the event being listened out for.
 * Declare a variable and assign the funciton to it.
 * Example usage:
 * ```typescript
 * const data = await waitFor(socket, 'message')
 * ```
 */
function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

interface JoinLobbyResponse {
  success: boolean;
  confirmedLobbyId: string;
  error: string;
}

jest.mock("../../utils/roomUtils");

describe("socket event handler test", () => {
  let io: Server,
    serverSocket: ServerSocket,
    clientSocket1: ClientSocket,
    clientSocket2: ClientSocket;

  describe("2 clients:", () => {
    beforeEach((done) => {
      //Clean up mock for each test
      generateUniqueRoomIdMock.mockClear();

      //Create mock clients for testing
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket1 = ioc(`http://localhost:${port}`);
        // Instead of using "io.on()" as shown in socket.io documentation above,
        // pass the server instance to our imported "initalizeSocketHandler" so that we can test our event handlers
        initializeSocketHandler(io);
        clientSocket1.on("connect", () => {
          clientSocket2 = ioc(`http://localhost:${port}`);
          clientSocket2.on("connect", () => {
            done();
          });
        });
      });
    });

    afterEach((done) => {
      //Make sure to close connections for clean tests
      io.close();
      clientSocket1.disconnect();
      clientSocket2.disconnect();
      done();
    });

    describe("creating and joining socket rooms", () => {
      test("client socket can create a room and have others join", (done) => {
        generateUniqueRoomIdMock.mockReturnValue("1234");

        const checkClientsInRoom = () => {
          const room = io.sockets.adapter.rooms.get("1234");

          expect(room?.has(clientSocket1.id ?? "")).toBe(true);
          expect(room?.has(clientSocket2.id ?? "")).toBe(true);
          done();
        };

        //As "create_lobby" & "join_lobby" expects a callback, we have to chain emits like this
        //If re-written to have "io.emit" or "socket.emit", then set up "event listeners" instead.
        clientSocket1.emit("create_lobby", "clientSocket1", () => {
          clientSocket2.emit(
            "join_lobby",
            { localLobbyId: "1234", userId: "clientSocket2" },
            () => {
              checkClientsInRoom();
            }
          );
        });
      });

      test("clients can leave a room", (done) => {
        generateUniqueRoomIdMock.mockReturnValue("1234");

        const checkClientsInRoom = () => {
          const room = io.sockets.adapter.rooms.get("1234");
          expect(room?.has(clientSocket1.id ?? "")).toBe(true);
          expect(room?.has(clientSocket2.id ?? "")).toBe(false);
          done();
        };

        clientSocket1.emit("create_lobby", "clientSocket1", () => {
          clientSocket2.emit(
            "join_lobby",
            {
              localLobbyId: "1234",
              userId: "clientSocket2",
            },
            () => {
              console.log("test");
              clientSocket2.emit(
                "leave_lobby",
                { lobbyId: "1234" },
                checkClientsInRoom
              );
            }
          );
        });
      });

      test("clients can only be in one room at a time", (done) => {
        generateUniqueRoomIdMock
          .mockReturnValueOnce("1234")
          .mockReturnValueOnce("5678");

        const checkClientsInRooms = () => {
          const room1234 = io.sockets.adapter.rooms.get("1234");
          const room5678 = io.sockets.adapter.rooms.get("5678");

          expect(room1234).toBeDefined();
          expect(room5678).toBeDefined();
          expect(room1234?.has(clientSocket1.id ?? "")).toBe(true);
          expect(room1234?.has(clientSocket2.id ?? "")).toBe(false);
          expect(room5678?.has(clientSocket1.id ?? "")).toBe(false);
          expect(room5678?.has(clientSocket2.id ?? "")).toBe(true);
          done();
        };

        clientSocket1.emit("create_lobby", "clientSocket1", () => {
          clientSocket2.emit(
            "join_lobby",
            {
              localLobbyId: "1234",
              userId: "clientSocket2",
            },
            () => {
              clientSocket2.emit("create_lobby", "clientSocket2", () => {
                checkClientsInRooms();
              });
            }
          );
        });
      });

      test("client can't join a room that doesn't exist", (done) => {
        clientSocket1.emit(
          "join_lobby",
          {
            localLobbyId: "1234",
            userId: "clientSocket1",
          },
          (response: JoinLobbyResponse) => {
            const room1234 = io.sockets.adapter.rooms.get("1234");
            expect(room1234).toBeUndefined();
            expect(response.success).toEqual(false);
            expect(response.error).toBe("Couldn't find lobby. Does it exist?");
            done();
          }
        );
      });
    });

    describe("Game related events", () => {
      test("client can start a game", async () => {
        generateUniqueRoomIdMock.mockReturnValueOnce("1234");

        await new Promise<void>((resolve) => {
          clientSocket1.emit("create_lobby", "clientSocket1", () => {
            clientSocket2.emit(
              "join_lobby",
              {
                localLobbyId: "1234",
                userId: "clientSocket2",
              },
              () => {
                clientSocket1.emit("start_game", {
                  lobbyId: "1234",
                  members: ["clientSocket1", "clientSocket2"],
                });
                resolve();
              }
            );
          });
        });

        const gameStartedData: any = await waitFor(
          clientSocket1,
          "game_initialised"
        );

        expect(gameStartedData.path).toBe("/game/1234");

        expect(
          gameStartedData.gameState.players["clientSocket1"]
        ).toBeDefined();
        expect(
          gameStartedData.gameState.players["clientSocket1"].gameCard.rows
        ).toBeTruthy();
        expect(
          gameStartedData.gameState.players["clientSocket1"].gameCard.rows
        ).toEqual({
          red: [],
          yellow: [],
          green: [],
          blue: [],
        });

        expect(
          gameStartedData.gameState.players["clientSocket2"]
        ).toBeDefined();
        expect(
          gameStartedData.gameState.players["clientSocket2"].gameCard.rows
        ).toBeTruthy();
        expect(
          gameStartedData.gameState.players["clientSocket2"].gameCard.rows
        ).toEqual({
          red: [],
          yellow: [],
          green: [],
          blue: [],
        });
      });

      test.only("can mark a number", async () => {
        generateUniqueRoomIdMock.mockReturnValueOnce("1234");

        await new Promise<void>((resolve) => {
          clientSocket1.emit("create_lobby", "clientSocket1", () => {
            clientSocket2.emit(
              "join_lobby",
              {
                localLobbyId: "1234",
                userId: "clientSocket2",
              },
              () => {
                clientSocket1.emit("start_game", { lobbyId: "1234" });
                resolve();
              }
            );
          });
        });

        await new Promise<void>((resolve) => {
          clientSocket1.on("game_initialised", () => {
            clientSocket1.emit("roll_dice", { lobbyId: "1234" });
            resolve();
          });
        });

        await new Promise<void>((resolve) => {
          clientSocket2.on("dice_rolled", () => {
            clientSocket2.emit(
              "mark_numbers",
              {
                lobbyId: "1234",
                userId: "clientSocket2",
                playerChoice: { row: "red", num: 10 },
              },
              (success: boolean) => {
                expect(success).toBe(true);
              }
            );
            resolve();
          });
        });

        const updatedGameState: any = await waitFor(
          clientSocket2,
          "update_marked_numbers"
        );

        const player2 = updatedGameState.gameState.players.clientSocket2;
        expect(player2).toEqual({
          gameCard: {
            rows: { red: [10], yellow: [], green: [], blue: [] },
            isLocked: { red: false, yellow: false, green: false, blue: false },
            penalties: [],
          },
          hasSubmittedChoice: true,
        });
      });
    });
  });
});
