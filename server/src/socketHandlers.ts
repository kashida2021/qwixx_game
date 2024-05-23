import { Server } from "socket.io";

export default function initializeSocketHandler(io: Server) {
 //For getting visibility on which sockets are in each room
 const roomSockets: Record<string, string[]> = {};

 io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on("join_room", (data: string) => {
   //Checking if there are any rooms currently connected to. If so looping through each room and users. If user connected to a room, leave the room. Also remove the user from the room sockets object
   if (roomSockets) {
    for (const [prevRoom, users] of Object.entries(roomSockets)) {
     if (users.includes(socket.id)) {
      socket.leave(prevRoom);
      const index = users.indexOf(socket.id);
      users.splice(index, 1);
     }
    }
   }

   socket.join(data);
   console.log(`Socket ${socket.id} connected to room ${data}`);
   socket.emit("join_room_success", data);
   //Setting data inside the roomSockets object above for visibility on what sockets are in what room
   //Can delete later if necessary
   if (!roomSockets[data]) {
     roomSockets[data] = [socket.id];
   }else {
     roomSockets[data].push(socket.id)
   }
   
   const room = io.sockets.adapter.rooms.get(data);
   console.log("Sockets in room", room);

   console.log("Rooms a socket is connected to", socket.rooms);
   console.log(roomSockets)
  });

  socket.on("create_lobby", () => {
    socket.join("1234");
    socket.emit("create_lobby_success", "1234");
    console.log("create_room_success")
  })

  socket.on("disconnect", () => {
   console.log(`User ${socket.id} disconnected`);
  });
 });
}
