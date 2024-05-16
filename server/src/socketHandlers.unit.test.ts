//Should first separate the socket events from index.ts so that we have better separation
//It also makes it easier to test. Something like the following:
//import * from "./socketHandler"

import { Server } from "socket.io";
import { Socket } from "socket.io-client";
import initializeSocketHandler from "./socketHandlers";

describe("socket events", () => {

//  beforeEach(() => {
//   const io: Server = {} as Server;
//   // Mocking a client socket. When a client connects to a socket.io server, the connection is represented by a socket object.
//   // Socket objects encapsulates all communication between client and server.
//   // That's why it has built in methods that allows communications between client and server which we can mock.
//   const socket = {
//    id: "mockSocketId",
//    join: jest.fn(),
//    emit: jest.fn(),
//   };
//  });

//  initializeSocketHandler(io); 

//  afterEach(() => {
//   jest.clearAllMocks();
//  });

beforeEach(() => {
	const mockSocket: Socket = {
		on: jest.fn(), 
		emit: jest.fn(), 
	}

	const mockServer: Server = {
		on: jest.fn(), 
	}

	initializeSocketHandler(mockServer); 
})

 it("should join a room", () => {
  const data = "1";
  //Simulating a connection event that is usually abstracted away by socket.io under the hood.
  //It broadcast information that a client socket has connected which triggers event handlers defined in "io.on()"
  io.emit("connection", socket);
  io.emit("join_room", data);
  expect(socket.join).toHaveBeenCalledWith(data);
  expect(socket.emit).toHaveBeenCalledWith("join_room_success", data);
 });

 it.todo(
  "should leave the room"
  //  () => {
  //   const socket = {
  //    id: "test-socket-id",
  //    join: jest.fn(),
  //    emit: jest.fn(),
  //   };

  // Call the leave room event

  // Assert that the room doesn't have the socket anymore
  // Assert that the room doesn't exist??
  //  }
 );
});
