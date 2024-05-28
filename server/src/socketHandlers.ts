import { Server } from "socket.io";
import { generateUniqueRoomId } from "./roomUtils";

export default function initializeSocketHandler(io: Server) {
 //For getting visibility on which sockets are in each room
 const roomSockets: Record<string, string[]> = {};

 io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  //Useful methods for getting visibilty on rooms
  //Shows all sockets in all rooms
  //io.sockets.adapter.rooms

  //Shows all sockets connected to a specificed room
  // io.sockets.adapter.rooms.get(room_id);

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
   const rooms = Array.from(io.sockets.adapter.rooms).map(
    ([roomName, sockets]) => roomName
   );
   let room = generateUniqueRoomId(rooms);

   //Returns all the rooms a socket is currently in.
   //  let socketRoomsArray = Array.from(socket.rooms.values()).filter((room) => room !==socket.id);
   let socketRoomsArray = Array.from(socket.rooms);

   //Makes sures a socket can only ever be in one room
   if (socket.rooms.size === 2) {
    socket.leave(socketRoomsArray[1]);
    socket.join(room);
   }

   socket.join(room);
   socket.emit("create_lobby_success", room);
   console.log(`Server: create_lobby_success: ${room}`);
   console.log(`Client socket is in these rooms:${Array.from(socket.rooms)}`);
  });

  socket.on("disconnect", () => {
   console.log(`User ${socket.id} disconnected`);
  });
 });
}
