import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

const server = createServer(app);
app.use(cors());

// const PORT = process.env.PORT || 3000;

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
  console.log(`A user connected to room ${data}`)
 });

//  socket.on("disconnect", () => {
//   console.log(`User ${socket.id} disconnected`);
//  });
});

server.listen(3001, () => {
 console.log("listening on *:3001");
});
