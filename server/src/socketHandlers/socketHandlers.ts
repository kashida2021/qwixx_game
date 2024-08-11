import { Server, Socket } from "socket.io";
import { generateUniqueRoomId } from "../utils/roomUtils";
// import GameBoard from "../../../shared/GameBoard";
// import GameBoard from "../models/GameBoardTemp";
import QwixxLogic from "../services/QwixxLogic";
import { initializePlayers } from "../models/InitializePlayer";
import { initializeGameCards } from "../models/InitializeGameCards";
import Dice from "../models/DiceClass";
import SixSidedDie from "../models/SixSidedDieClass";
import Lobby from "../models/LobbyClass";

//Useful methods for getting visibilty on rooms

//Shows all sockets in all rooms:
//io.sockets.adapter.rooms

//Shows all sockets connected to a specificed room:
// io.sockets.adapter.rooms.get(room_id);

//Shows the rooms a socket is connected to:
// socket.rooms

//Can filter out the socket's own private room:
//  let socketRoomsArray = Array.from(socket.rooms.values()).filter((room) => room !==socket.id);

const removeSocketFromRooms = (socket: Socket): void => {
  let socketRoomsArray = Array.from(socket.rooms);
  if (socketRoomsArray.length > 1) {
    for (let i = 1; i < socketRoomsArray.length; i++) {
      socket.leave(socketRoomsArray[i]);
    }
  }
};

//function to filter room within lobby object to remove target Id
//this can probably be deleted now we are using LobbyClass and methods
//const filterLobbyIds = (lobby: string[], userId: string): string[] => {
//return lobby.filter((id) => id !== userId);
//};

// Loops through each lobby in lobbies object and then callback filter function
//this can probably be deleted now we are using LobbyClass and methods
//const updateLobbies = (
//lobbies: { [key: string]: string[] },
//userId: string
//): void => {
//for (const roomId in lobbies) {
//if (lobbies.hasOwnProperty(roomId)) {
//lobbies[roomId] = filterLobbyIds(lobbies[roomId], userId);
//}
//}
//};

let game;

export default function initializeSocketHandler(io: Server) {
  //Object tracks current Lobby for each socketId. Key is SocketId and value is roomId
  const roomSockets: { [key: string]: string } = {};
  //Object tracks all lobbies and connected users in an array of strings
  //const lobbies: { [key: string]: string[] } = {};

  //Object tracks all lobbies using lobby class
  const lobbiesMap: { [key: string]: Lobby } = {};

  // Object that maps each socket.id to corresponding userId - can access this when disconnects
  const userIdList: { [key: string]: string } = {};

  // interface LobbyGameBoards {
  //   [lobbyId: string]: {
  //     [clientId: string]: GameBoard;
  //   };
  // }

  // const lobbyGameBoards: LobbyGameBoards = {};

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("create_lobby", (userId, callback) => {
      const rooms = Array.from(io.sockets.adapter.rooms.keys());
      let room = generateUniqueRoomId(rooms);

      //lobbies[room] = [userId];
      lobbiesMap[room] = new Lobby(room);

      removeSocketFromRooms(socket);

      socket.join(room);
      roomSockets[socket.id] = room;
      lobbiesMap[room].addPlayer(userId);
      callback(room);
      console.log(
        `Server: create_lobby_success: Client "${userId}" created ${room}`
      );
    });

    socket.on("join_lobby", ({ localLobbyId, userId }, callback) => {
      //adds socket.id userId pair to userIdList object
      userIdList[socket.id] = userId;

      //If the lobby doesn't exist, return error
      //if (!lobbies[localLobbyId]) {
      if (!lobbiesMap[localLobbyId]) {
        callback({
          success: false,
          confirmedLobbyId: "",
          error: "Couldn't find lobby. Does it exist?",
          lobbyMembers: [],
        });
        return;
      }

      //Checks if lobby is full
      if (
        //Array.isArray(lobbies[localLobbyId]) &&
        //lobbies[localLobbyId].length === 4
        Array.isArray(lobbiesMap[localLobbyId].players) &&
        lobbiesMap[localLobbyId].players.length === 4
      ) {
        callback({
          success: false,
          confirmedLobbyId: "",
          error: "Lobby is full",
          lobbyMembers: [],
        });
        return;
      }

      //If the socket is in a room, leave it - do we need this. Can we just call removeSocket function?
      if (roomSockets[socket.id]) {
        const currentLobby = roomSockets[socket.id];
        socket.leave(currentLobby);
        io.to(currentLobby).emit("user_left", { userId: socket.id });
        console.log("socket left room");
      }

      //Join lobby
      //lobbies[localLobbyId].push(userId);
      lobbiesMap[localLobbyId].addPlayer(userId);
      roomSockets[socket.id] = localLobbyId;

      socket.join(localLobbyId);
      //io.to(localLobbyId).emit("player_joined", lobbies[localLobbyId], userId);
      io.to(localLobbyId).emit(
        "player_joined",
        lobbiesMap[localLobbyId].players,
        userId
      );
      callback({
        success: true,
        confirmedLobbyId: localLobbyId,
        error: "",
        //lobbyMembers: lobbies[localLobbyId],
        lobbyMembers: lobbiesMap[localLobbyId].players,
      });
      console.log(`Client "${userId}" joined: ${roomSockets[socket.id]}`);
      console.log(lobbiesMap[localLobbyId].players);
    });

    // When a player explicity leaves a room - checks if roomId is already in roomSockets object. Then it will leave the currentRoom and also remove from roomSockets object.
    socket.on("leave_lobby", ({ lobbyId, userId }, callback) => {
      if (roomSockets[socket.id] === lobbyId) {
        socket.leave(lobbyId);
        callback({ success: true });
        delete roomSockets[socket.id];
        delete userIdList[socket.id];
      }

      //updateLobbies(lobbies, userId);
      lobbiesMap[lobbyId].removePlayer(userId);

      //io.to(lobbyId).emit("user_left", lobbies[lobbyId], userId);
      io.to(lobbyId).emit("user_left", lobbiesMap[lobbyId].players, userId);

      //if (lobbies[lobbyId] && lobbies[lobbyId].length <= 0) {
      //delete lobbies[lobbyId];
      //}
      if (lobbiesMap[lobbyId] && lobbiesMap[lobbyId].players.length <= 0) {
        delete lobbiesMap[lobbyId];
      }
    });

    // Handles disconnect. If disconnected check to see if socketId is connected to a room. Will remove the socket from an existing room and delete from roomSockets object.
    socket.on("disconnect", () => {
      const currentLobby = roomSockets[socket.id];
      //updateLobbies(lobbies, userIdList[socket.id]);

      if (lobbiesMap[currentLobby]) {
        lobbiesMap[currentLobby].removePlayer(userIdList[socket.id]);
      }

      if (currentLobby) {
        socket.leave(currentLobby);
        io.to(currentLobby).emit(
          "user_disconnected",
          //lobbies[currentLobby],
          lobbiesMap[currentLobby].players,
          userIdList[socket.id]
        );
        delete roomSockets[socket.id];
        delete userIdList[socket.id];
      }

      //if (lobbies[currentLobby] && lobbies[currentLobby].length <= 0) {
      //delete lobbies[currentLobby];
      //}
      if (
        lobbiesMap[currentLobby] &&
        lobbiesMap[currentLobby].players.length <= 0
      ) {
        delete lobbiesMap[currentLobby];
      }
    });

    socket.on("start_game", ({ lobbyId, members }) => {
      // const gameBoard = new GameBoard();

      // if (!lobbyGameBoards[lobbyId]) {
      //   lobbyGameBoards[lobbyId] = {};
      // }

      // lobbyGameBoards[lobbyId][userId] = gameBoard;

      // socket.emit("gameBoard_created", gameBoard.serialize());
      // callback({ success: true });

      // Instantiate relevant classes
      const gameCards = initializeGameCards(members);
      const playerObjects = initializePlayers(members, gameCards);
      const dice = new Dice(SixSidedDie);
      game = new QwixxLogic(playerObjects, dice);

      // Create path data and players' gameboard states to send back to client
      const initialPlayersState = game.players;
      const path = `/game/${lobbyId}`;
      const responseData = { path: path, players: initialPlayersState };

      io.to(lobbyId).emit("game_initialised", responseData);
    });
  });
}
