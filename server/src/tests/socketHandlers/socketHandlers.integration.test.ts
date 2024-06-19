// Setup for this test came from socket.io website @https://socket.io/docs/v4/testing/

import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import initializeSocketHandler from "../../socketHandlers/socketHandlers";

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
      clientSocket1.emit("create_lobby", "clientSocket1", () => {
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
      clientSocket1.emit("create_lobby", "clientSocket1", () => {
        checkRoomQuantity();
      });
      clientSocket1.emit("create_lobby", "clientSocket1", () => {
        checkRoomQuantity();
      });
    });
  });

  describe.skip("socket event handlers with 2 clients", () => {
    beforeEach((done) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = (httpServer.address() as AddressInfo).port;
        clientSocket1 = ioc(`http://localhost:${port}`);
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

    it.skip("Can start a game", (done) => {
      clientSocket1.emit("create_lobby", "clientSocket1", () => {
        clientSocket2.emit("join_lobby", {
          localLobbyId: "1234",
          userId: "clientSocket2",
        }, () => {
            console.log(io.sockets.adapter.rooms.get("1234")); 
            done(); 
        });
      });

    });
  });
});
