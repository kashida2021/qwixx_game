import { Server } from "socket.io";

export default function initializeSocketHandler(io: Server) {
 io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("join_room", (data: string) => {
   socket.join(data);
   console.log(`Socket ${socket.id} connected to room ${data}`);
   socket.emit("join_room_success", data);
   //Setting data inside the roomSockets object above for visibility on what sockets are in what room
   //Can delete later if necessary
   // if (!roomSockets[data]) {
   //   roomSockets[data] = [socket.id];
   // }else {
   //   roomSockets[data].push(socket.id)
   // }
   const room = io.sockets.adapter.rooms.get(data);
   console.log(room);
   // console.log(roomSockets)
  });

  socket.on("disconnect", () => {
   console.log(`User ${socket.id} disconnected`);
  });
 });
}
