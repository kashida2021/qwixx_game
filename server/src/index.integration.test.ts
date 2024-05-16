import request from "supertest";
import { app, server, io } from "./index";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";

describe.skip("Express App", () => {
 afterAll((done) => {
  server.close(done);
 });

 it("should start the server and respond with 404 for an unknown route", async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(404);
 });

 it.skip("responds with 200 for GET /", async () => {
  const response = await request(app).get("/");
  expect(response.status).toBe(200);
 });
});

describe("socket events", () => {
 let clientSocket1: ClientSocket;
 let clientSocket2: ClientSocket;

 beforeEach((done) => {
  // clientSocket1 = ioc("http://localhost:3001");
  // clientSocket1.on("connect", () => {
  //   done(); 
  // })

  clientSocket1 = ioc("http://localhost:3001");
  clientSocket1.on("connect", () => {
   clientSocket2 = ioc("http://localhost:3001");
   clientSocket2.on("connect", () => {
    done();
   });
  });
 });

 afterEach((done) => {
  io.close();
  clientSocket1.disconnect();
  clientSocket2.disconnect();
  done();
 });

 it("should handle 'join_room' event", (done) => {
  // clientSocket1.emit("join_room", "2");

  // clientSocket1.on("join_room_success", () => {
  //  const room = io.sockets.adapter.rooms.get("2");
  //  //  console.log(room)
  //  expect(room).toBeDefined();
  //  expect(room?.has(clientSocket1.id ?? "")).toBe(true);
  //  done();
  // });

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
});
