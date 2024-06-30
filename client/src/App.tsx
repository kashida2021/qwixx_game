import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/HomePage";
import Lobby from "./pages/Lobby/Lobby";
import { socket } from "./services/socketServices";
import GameBoard from '../../shared/GameBoard';
import Game from './pages/Game/Game';

function App() {
 const [isConnected, setIsConnected] = useState(socket.connected);
 const [lobbyId, setLobbyId] = useState("");
 const [userId, setUserId] = useState("");
 //const [globalError, setGlobalError] = useState("");
 const [members, setMembers] = useState<string[]>([]);
 const [notifications, setNotifications] = useState<string[]>([]);
 const [gameBoardState, setGameBoardState] = useState<GameBoard | null>(null);

 //Need to consier if this is overkill for our app as it's only being used in one place.
 //  const handleInputChange =
 //   (setter: React.Dispatch<React.SetStateAction<string>>) =>
 //   (e: ChangeEvent<HTMLInputElement>) => {
 //    e.preventDefault();
 //    setter(e.target.value);
 //   };

 // At the moment, the socketService class gets instantiated when the .connect() method is called.
 // Can consider refactoring to use a custom hook or useContext() api.

 // The better way with error handling:
 //  const connectSocket = async () => {
 //   try {
 //    await socketService.connect("http://localhost:3001");
 //    setIsLoading(true);
 //   } catch (err) {
 //    console.error("Failed to connect to server", err);
 //   }
 //  };

 useEffect(() => {
  const onConnect = () => {
   console.log("connected to server");
   setIsConnected(true);
  };

  const onDisconnect = () => {
   console.log("disconnected from server");
   setIsConnected(false);
  };

  const handlePlayerJoined = (lobbyMembers: string[], user: string) => {
    setMembers(lobbyMembers);
    setNotifications((prevNotifications) => [...prevNotifications, `${user} has joined`])
  };

  const handleUserLeft = (lobbyMembers: string[], user: string) => {
    setMembers(lobbyMembers);
    setNotifications((prevNotifications) => [...prevNotifications, `${user} has left`])
  };

  const handleUserDisconnected = (lobbyMembers: string[], user: string) => {
    setMembers(lobbyMembers);
    setNotifications((prevNotifications) => [...prevNotifications, `${user} has disconnected`]);
  };

  const currentMembers = (lobbyMembers: string[]) => {
    setMembers(lobbyMembers);
  }

  const createGameBoard = (data: GameBoard) => {
    const gameBoard = GameBoard.from(data);
    setGameBoardState(gameBoard);
  }

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("player_joined", handlePlayerJoined);
  socket.on("user_left", handleUserLeft);
  socket.on("user_disconnected", handleUserDisconnected);
  socket.on("current_members", currentMembers);
  socket.on("gameBoard_created", createGameBoard);


  return () => {
   socket.off("connect");
   socket.off("disconnect");
   socket.off("player_joined");
   socket.off("user_left");
   socket.off("user_disconnected");
   socket.off("current_members");
   socket.off("gameBoard_created");
  };
 }, []);

 return (
  <Router>
   <Routes>
    <Route
     path="/"
     element={
      <Home
       socket={socket}
       isConnected={isConnected}
       setLobbyId={setLobbyId}
       userId={userId}
       setUserId={setUserId}
       setMembers={setMembers}
      />
     }
    />
    <Route path={`/lobby/${lobbyId}`} element={<Lobby socket={socket} lobbyId={lobbyId} userId={userId} members={members} setMembers={setMembers} notifications={notifications} setNotifications={setNotifications}/>} />
    <Route path={`/game/${lobbyId}`} element={<Game gameBoardState={gameBoardState} socket={socket} lobbyId={lobbyId} userId={userId} members={members} setGameBoardState={setGameBoardState} />} />
   </Routes>
  </Router>
 );
}

export default App;
