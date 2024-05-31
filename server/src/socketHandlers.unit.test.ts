// Setup for this test came from socket.io website @https://socket.io/docs/v4/testing/

import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import initializeSocketHandler from "./socketHandlers";
import { generateUniqueRoomId } from "./roomUtils";
const generateUniqueRoomIdMock = generateUniqueRoomId as jest.MockedFunction<
 typeof generateUniqueRoomId
>;

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
 return new Promise((resolve) => {
  socket.once(event, resolve);
 });
}

//Mock the "generateUniqueRoomId" function for controlled testing
jest.mock("./roomUtils", () => {
 const generateUniqueRoomId = jest.fn();
 return { generateUniqueRoomId };
});

describe("socket event handler test", () => {
 let io: Server,
  serverSocket: ServerSocket,
  clientSocket1: ClientSocket,
  clientSocket2: ClientSocket;

 describe("2 clients:", () => {
  beforeEach((done) => {
   //Clean up mock for each test
   generateUniqueRoomIdMock.mockReset();

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

  test("client socket can create a room and have others join", (done) => {
   //This lets us mock our function's return value for controlled testing
   generateUniqueRoomIdMock.mockReturnValue("1234");
   
   //This function is called to run our test assertions once all the "events" have finished
   //Pass the "done()" to it to let our test know when to finish.
   //If it doesn't reach "done()", it means either the source code or test setup has a problem.
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
      clientSocket2.emit("leave_lobby", { lobbyId: "1234" });
     }
    );
   });

   clientSocket1.on("user_left", checkClientsInRoom);
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

  test.todo("client cannot join a full room");
 });
});
