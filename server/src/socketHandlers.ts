import { Server } from "socket.io";
import { generateUniqueRoomId } from "./roomUtils";
//Useful methods for getting visibilty on rooms
//Shows all sockets in all rooms
//io.sockets.adapter.rooms

//Shows all sockets connected to a specificed room
// io.sockets.adapter.rooms.get(room_id);

export default function initializeSocketHandler(io: Server) {
 //Object tracks current Lobby for each socketId. Key is SocketId and value is roomId
 const roomSockets: { [key: string]: string } = {};

 //Object tracks all lobbies and connected users in an array of strings
 const lobbies: { [key: string]: string[] } = {};

 // Object that maps each socket.id to corresponding userId - can access this when disconnects
 const userIdList: { [key: string]: string } = {};

 io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  //function to filter room within lobby object to remove target Id
  const filterLobbyIds = (lobby: string[], userId: string): string[] => {
   return lobby.filter((id) => id !== userId);
  };

  // Loops through each lobby in lobbies object and then callback filter function
  const updateLobbies = (
   lobbies: { [key: string]: string[] },
   userId: string
  ): void => {
   for (const roomId in lobbies) {
    if (lobbies.hasOwnProperty(roomId)) {
     lobbies[roomId] = filterLobbyIds(lobbies[roomId], userId);
    }
   }
  };
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
   console.log(
    `Client socket is in room:${Array.from(socket.rooms.values()).filter(
     (room) => room !== socket.id
    )}`
   );
  });

  socket.on("join_lobby", ({ lobbyId, userId }) => {
   //adds socket.id userId pair to userIdList object
   console.log(`join_lobby event received: ${lobbyId}, ${userId}`);

   userIdList[socket.id] = userId;

   //If the lobby doesn't exist, create that room
   if (!lobbies[lobbyId]) {
    lobbies[lobbyId] = [];
   }

   //If the socket is in a room, leave it
   if (roomSockets[socket.id]) {
    const currentLobby = roomSockets[socket.id];
    socket.leave(currentLobby);
    io.to(currentLobby).emit("user_left", { userId: socket.id });
    console.log("socket left room");
   }

   //If that lobby has less than 4 players
   //Add the userId to that lobby
   //Join that room
   //Add that room to that sockets list of rooms
   //Emit to other players that a player has joined
   //Else emit lobby is full
   if (lobbies[lobbyId].length < 4) {
    lobbies[lobbyId].push(userId);
    roomSockets[socket.id] = lobbyId;

    socket.join(lobbyId);
    io.to(lobbyId).emit("player_joined", lobbies[lobbyId]);
    socket.emit("joined_lobby", lobbyId);
    console.log("The socket is in", roomSockets[socket.id], lobbyId),
     lobbies[lobbyId];
   } else {
    socket.emit("lobby_full");
    console.log("Lobby full");
   }
  });

  // When a player explicity leaves a room - checks if roomId is already in roomSockets object. Then it will leave the currentRoom and also remove from roomSockets object.
  socket.on("leave_lobby", ({ lobbyId, userId }) => {
   if (roomSockets[socket.id] === lobbyId) {
    socket.leave(lobbyId);
    // console.log(`Socket ${userId} has left Room ${lobbyId}`);
    delete roomSockets[socket.id];
    delete userIdList[socket.id];
   }

   updateLobbies(lobbies, userId);

   io.to(lobbyId).emit("user_left", { userId: socket.id });
   socket.emit("left_lobby")
   if (lobbies[lobbyId] && lobbies[lobbyId].length <= 0) {
    delete lobbies[lobbyId];
   }

   //  console.log(roomSockets);
   //  console.log(lobbies);
   //  console.log(userIdList);
  });

  // Handles disconnect. If disconnected check to see if socketId is connected to a room. Will remove the socket from an existing room and delete from roomSockets object.
  socket.on("disconnect", () => {
   const currentLobby = roomSockets[socket.id];
   updateLobbies(lobbies, userIdList[socket.id]);

   if (currentLobby) {
    socket.leave(currentLobby);
    // console.log(`Socket ${socket.id} has left Room ${currentLobby}`);
    io.to(currentLobby).emit("user_left", { userId: socket.id });
    delete roomSockets[socket.id];
    delete userIdList[socket.id];
   }

   if (lobbies[currentLobby] && lobbies[currentLobby].length <= 0) {
    delete lobbies[currentLobby];
   }

   //  console.log(roomSockets);
   //  console.log(lobbies);
   //  console.log(userIdList);
  });
 });
}
