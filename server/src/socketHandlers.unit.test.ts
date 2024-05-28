// Setup for this test came from socket.io website @https://socket.io/docs/v4/testing/

import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import initializeSocketHandler from "./socketHandlers";

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
 return new Promise((resolve) => {
  socket.once(event, resolve);
 });
}

describe("socket event handler test", () => {
 let io: Server,
  serverSocket: ServerSocket,
  clientSocket1: ClientSocket,
  clientSocket2: ClientSocket;

 describe("socket event handlers with 1 client", () => {
  beforeEach((done) => {
   const httpServer = createServer();
   io = new Server(httpServer);
   httpServer.listen(() => {
    const port = (httpServer.address() as AddressInfo).port;
    clientSocket1 = ioc(`http://localhost:${port}`);
    // Instead of using "io.on()" as shown in socket.io documentation above,
    // pass the server instance to our imported "initalizeSocketHandler" so that we can test our event handlers
    initializeSocketHandler(io);
    clientSocket1.on("connect", () => {
     done();
    });
   });
  });

  afterEach((done) => {
   io.close();
   clientSocket1.disconnect();
   done();
  });

  test("client socket can create a room", (done) => {
   clientSocket1.emit("create_lobby");

   clientSocket1.on("create_lobby_success", () => {
    const rooms = io.sockets.adapter.rooms.size;
    expect(rooms).toEqual(2);
    done();
   });
  });

  test("client can only create a single room", (done) => {
   let emitEventsCount = 0;

   const checkRoomQuantity = () => {
    emitEventsCount++;

    if (emitEventsCount === 2) {
     const rooms = io.sockets.adapter.rooms.size;
     expect(rooms).toEqual(2);
     done();
    }
   };
   //   console.log(`clientSocket1_id: ${clientSocket1.id}`)
   clientSocket1.emit("create_lobby");
   clientSocket1.emit("create_lobby");
   clientSocket1.on("create_lobby_success", checkRoomQuantity);
  });
 });

 describe("socket event handlers with 2 clients", () => {
  beforeEach((done) => {
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
   io.close();
   clientSocket1.disconnect();
   clientSocket2.disconnect();
   done();
  });
  //Probably need to somehow mock the generateRoomId function. 
  test.todo("client sockets can't create the same room")

  test("client sockets can join same room", (done) => {
   let clientsInRoom = 0;

   const checkClientsInRoom = () => {
    clientsInRoom++;

    if (clientsInRoom === 2) {
     const room = io.sockets.adapter.rooms.get("1");
     expect(room?.has(clientSocket1.id ?? "")).toBe(true);
     expect(room?.has(clientSocket2.id ?? "")).toBe(true);
     done();
    }
   };

   clientSocket1.emit("join_room", "1");
   clientSocket2.emit("join_room", "1");
   clientSocket1.on("join_room_success", checkClientsInRoom);
   clientSocket2.on("join_room_success", checkClientsInRoom);
  });

  //This test is fails as no code has been implemented to ensure clients are only ever in 1 room
  test("clients can join different rooms", (done) => {
   let clientsInRoom = 0;

   const checkClientsInRooms = () => {
    clientsInRoom++;
    if (clientsInRoom === 2) {
     const room1 = io.sockets.adapter.rooms.get("3");
     const room2 = io.sockets.adapter.rooms.get("4");

     expect(room1?.has(clientSocket1.id ?? "")).toBe(true);
     expect(room1?.has(clientSocket2.id ?? "")).toBe(false);
     expect(room2?.has(clientSocket1.id ?? "")).toBe(false);
     expect(room2?.has(clientSocket2.id ?? "")).toBe(true);
     done();
    }
   };

   clientSocket1.emit("join_room", "3");
   clientSocket2.emit("join_room", "4");
   clientSocket1.on("join_room_success", checkClientsInRooms);
   clientSocket2.on("join_room_success", checkClientsInRooms);
  });

  test.todo("clients can leave a room");
  test.todo("clients can only be in one room at a time");
 });
});
