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
let clientSocket: ClientSocket; 

beforeEach((done) => {
  clientSocket = ioc("http://localhost:3001"); 
  clientSocket.on('connect', () => {
    done(); 
  })
})

 afterEach((done) => {
  io.close();
  clientSocket.disconnect();
  done()
 });

 it("should handle 'join_room' event", (done) => {
  clientSocket.emit("join_room", "1");

  clientSocket.on("join_room_success", ()=> {
   const room = io.sockets.adapter.rooms.get("1");
   console.log(room)
   expect(room).toBeDefined();
   expect(room?.has(clientSocket.id ?? "")).toBe(true);
   done();
  }); 
 });
});
