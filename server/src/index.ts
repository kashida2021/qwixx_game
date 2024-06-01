import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import initializeSocketHandler from "./socketHandlers";
import { instrument } from "@socket.io/admin-ui";

const app = express(); // This creates an express app.

const server = createServer(app); // This creates an instance of http.Server using our express app.
app.use(cors());

// const PORT = process.env.PORT || 3000;

// This initializes Socket.IO with the http.Server instance.
// It allows it to listen to WebSocket events on the same port as our express server.
const io = new Server(server, {
 cors: {
  origin: ["http://localhost:5173", "https://admin.socket.io"],
//   methods: ["GET", "POST"],
  credentials: true, 
 },
});

initializeSocketHandler(io);

instrument(io, {
 auth: false,
 mode: "development",
});

server.listen(3001, () => {
 console.log("listening on *:3001");
});

export { app, server, io };
