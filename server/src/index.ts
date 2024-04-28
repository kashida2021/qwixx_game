import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

const server = createServer(app);
app.use(cors());

// const PORT = process.env.PORT || 3000;

//For getting visibility on which sockets are in each room
const roomSockets: Record<string, string[]> = {};

const io = new Server(server, {
 cors: {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
 },
});

io.on("connection", (socket) => {
 console.log(`A user connected: ${socket.id}`);

 socket.on("join_room", (data) => {
  socket.join(data);
  console.log(`Socket ${socket.id} connected to room ${data}`)

  //Setting data inside the roomSockets object above for visibility on what sockets are in what room
  //Can delete later if necessary
  if (!roomSockets[data]) {
    roomSockets[data] = [socket.id];
  }else {
    roomSockets[data].push(socket.id)
  }

  console.log(roomSockets)
 });

 socket.on("disconnect", () => {
  console.log(`User ${socket.id} disconnected`);
 });
});

server.listen(3001, () => {
 console.log("listening on *:3001");
});
