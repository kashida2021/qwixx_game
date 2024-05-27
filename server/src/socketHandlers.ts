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
   } else {
    roomSockets[data].push(socket.id);
   }

   const room = io.sockets.adapter.rooms.get(data);
   console.log("Sockets in room", room);

   console.log("Rooms a socket is connected to", socket.rooms);
   console.log(roomSockets);
  });

  socket.on("create_lobby", () => {
   //Need to check if the socket is already in a room
   //Need to check that the new room isn't the same as the old room

   const room = Math.floor(1000 + Math.random() * 9000).toString();

   let socketRoomsArray = Array.from(socket.rooms);
   //  if(socketRooms.has(room)){
   //   //call function again
   //  }

   if (socket.rooms.size === 2) {
    socket.leave(socketRoomsArray[1])
    socket.join(room);
   }

   socket.join(room)
   //  socketRooms.forEach((values, keys) => {
   //   console.log(values, keys);
   //  });

   socket.emit("create_lobby_success", room);
   console.log(`Server: create_lobby_success: ${room}`);
  });

  socket.on("disconnect", () => {
   console.log(`User ${socket.id} disconnected`);
  });
 });
}
