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

describe("socket event handlers with 2 clients", () => {
 let io: Server,
  serverSocket: ServerSocket,
  clientSocket1: ClientSocket,
  clientSocket2: ClientSocket;

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

 // Example of a test if we were connecting only one socket.
 // In the beforeAll() above we are connecting 2 sockets.
 //  test("should work", (done) => {
 //   clientSocket1.emit("join_room", "1");
 //   clientSocket1.on("join_room_success", () => {
 //    const room = io.sockets.adapter.rooms.get("1");
 //    expect(room?.has(clientSocket1.id ?? "")).toBe(true);
 //    done();
 //   });
 //  });

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
 test.only("clients can only be in one room at a time", (done) => {
    let clientsInRoom = 0;

  const checkClientsInRooms = () => {
   clientsInRoom++;
   if (clientsInRoom === 5) {
    const room3 = io.sockets.adapter.rooms.get("3");
    const room6 = io.sockets.adapter.rooms.get("6");

    expect(room3?.has(clientSocket1.id ?? "")).toBe(true);
    expect(room3?.has(clientSocket2.id ?? "")).toBe(false);
    expect(room6?.has(clientSocket1.id ?? "")).toBe(false);
    expect(room6?.has(clientSocket2.id ?? "")).toBe(true);
    done();
   }
  };

  clientSocket1.emit("join_room", "3");
  clientSocket2.emit("join_room", "3");
  clientSocket2.emit("join_room", "6");
  clientSocket1.on("join_room_success", checkClientsInRooms);
  clientSocket2.on("join_room_success", checkClientsInRooms);
  clientSocket2.on("join_room_success", checkClientsInRooms);
 });
});
