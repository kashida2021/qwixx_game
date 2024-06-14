import { Server } from "socket.io";
import { generateUniqueRoomId } from "./roomUtils";
//Useful methods for getting visibilty on rooms

//Shows all sockets in all rooms:
//io.sockets.adapter.rooms

//Shows all sockets connected to a specificed room:
// io.sockets.adapter.rooms.get(room_id);

//Shows the rooms a socket is connected to:
// socket.rooms

//Can filter out the socket's own private room:
//  let socketRoomsArray = Array.from(socket.rooms.values()).filter((room) => room !==socket.id);

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

  socket.on("create_lobby", (userId, callback) => {
   
   // Returns an array of rooms 
   const rooms = Array.from(io.sockets.adapter.rooms.keys());
   let room = generateUniqueRoomId(rooms);

   lobbies[room] = [userId];

   //Returns all the rooms a socket is currently in.
   let socketRoomsArray = Array.from(socket.rooms);

   //Makes sures a socket can only ever be in one room excluding its own unique room
   if (socketRoomsArray.length > 1) {
    for (let i = 1; i < socketRoomsArray.length; i++) {
      socket.leave(socketRoomsArray[i]);
        }
    }

   socket.join(room);
   roomSockets[socket.id] = room;
   callback(room);
   console.log(`Server: create_lobby_success: Client "${userId}" created ${room}`);
   //  console.log(
   //   `Client socket is in room:${Array.from(socket.rooms.values()).filter(
   //    (room) => room !== socket.id
   //   )}`
   //  );
  });


  socket.on("join_lobby", ({ localLobbyId, userId }, callback) => {
   //adds socket.id userId pair to userIdList object
   userIdList[socket.id] = userId;

   //If the lobby doesn't exist, return error
   if (!lobbies[localLobbyId]) {
    callback({
     success: false,
     confirmedLobbyId: "",
     error: "Couldn't find lobby. Does it exist?",
     lobbyMembers: []
    });
    return;
   }

   //Checks if lobby is full
   if (
    Array.isArray(lobbies[localLobbyId]) &&
    lobbies[localLobbyId].length === 4
   ) {
    callback({
     success: false,
     confirmedLobbyId: "",
     error: "Lobby is full",
     lobbyMembers: []
    });
    return;
   }

   //If the socket is in a room, leave it
   if (roomSockets[socket.id]) {
    const currentLobby = roomSockets[socket.id];
    socket.leave(currentLobby);
    io.to(currentLobby).emit("user_left", { userId: socket.id });
    console.log("socket left room");
   }

   //Join lobby
   lobbies[localLobbyId].push(userId);
   roomSockets[socket.id] = localLobbyId;

   socket.join(localLobbyId);
   io.to(localLobbyId).emit("player_joined", lobbies[localLobbyId], userId);
   callback({ success: true, confirmedLobbyId: localLobbyId, error: "", lobbyMembers: lobbies[localLobbyId] });
   console.log(`Client "${userId}" joined: ${roomSockets[socket.id]}`);
  });

  // When a player explicity leaves a room - checks if roomId is already in roomSockets object. Then it will leave the currentRoom and also remove from roomSockets object.
  socket.on("leave_lobby", ({ lobbyId, userId }, callback) => {
   if (roomSockets[socket.id] === lobbyId) {
    socket.leave(lobbyId);
    // console.log(`Socket ${userId} has left Room ${lobbyId}`);
    callback({ success: true });
    delete roomSockets[socket.id];
    delete userIdList[socket.id];
   }

   updateLobbies(lobbies, userId);

   io.to(lobbyId).emit("user_left", lobbies[lobbyId], userId);

   if (lobbies[lobbyId] && lobbies[lobbyId].length <= 0) {
    delete lobbies[lobbyId];
   }

  });

  // Handles disconnect. If disconnected check to see if socketId is connected to a room. Will remove the socket from an existing room and delete from roomSockets object.
  socket.on("disconnect", () => {
   const currentLobby = roomSockets[socket.id];
   updateLobbies(lobbies, userIdList[socket.id]);

   if (currentLobby) {
    socket.leave(currentLobby);
    // console.log(`Socket ${socket.id} has left Room ${currentLobby}`);
    io.to(currentLobby).emit("user_disconnected", lobbies[currentLobby], userIdList[socket.id]);
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

  socket.on("start_game", ({lobbyId, userId}) => {
    console.log(`Game started in lobby ${lobbyId}`);
  });

 });
}
