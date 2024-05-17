import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import initializeSocketHandler from "./socketHandlers";

const app = express(); // This creates an express app.

const server = createServer(app); // This creates an instance of http.Server using our express app.
app.use(cors());

// const PORT = process.env.PORT || 3000;

// This initializes Socket.IO with the http.Server instance.
// It allows it to listen to WebSocket events on the same port as our express server. 
const io = new Server(server, {
 cors: {
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
 },
});

io.on("connection", (socket) => {
 console.log(`A user connected: ${socket.id}`);

 socket.on("join_room", (data) => {
  
  //Checking if there are any rooms currently connected to. If so looping through each room and users. If user connected to a room, leave the room. Also remove the user from the room sockets object
  if(roomSockets){
   for(const[prevRoom, users] of Object.entries(roomSockets)){
      if(users.includes(socket.id)){
        socket.leave(prevRoom);
        const index = users.indexOf(socket.id);
        users.splice(index, 1);
      }
    }
 }
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
  console.log(socket.rooms)
 });

 socket.on("disconnect", () => {
  console.log(`User ${socket.id} disconnected`);
 });
});

initializeSocketHandler(io)

server.listen(3001, () => {
 console.log("listening on *:3001");
});

export {app, server, io}; 