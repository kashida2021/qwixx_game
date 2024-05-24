import "./App.css";
// import { ChangeEvent, FormEvent } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Lobby from "./pages/Lobby";
import socketService from "./services/socketServices";

function App() {
 const [lobbyId, setLobbyId] = useState("");
 const [isLoading, setIsLoading] = useState(false);

 // The better way with error handling: 
 //  const connectSocket = async () => {
 //   try {
 //    await socketService.connect("http://localhost:3001");
 //    setIsLoading(true);
 //   } catch (err) {
 //    console.error("Failed to connect to server", err);
 //   }
 //  };

 const connectSocket = () => {
  socketService.connect("http://localhost:3001");
  if(socketService){
    setIsLoading(true);
  }
 };

 useEffect(() => {
  connectSocket();
 }, []);

 if (!isLoading) {
  return <div>Loading...</div>;
 }

 return (
  <Router>
   <Routes>
    <Route path="/" element={<Home lobbyId={lobbyId} setLobbyId={setLobbyId} />} />
    <Route path={`/lobby/${lobbyId}`} element={<Lobby lobbyId={lobbyId} />} />
   </Routes>
  </Router>
 );
}

export default App;

//  const navigate = useNavigate();
//  const handleRoomInput = (e: ChangeEvent<HTMLInputElement>):void => {
//   e.preventDefault();
//   setRoom(e.target.value);
//  };

//  const joinRoom = (e: FormEvent<HTMLButtonElement>):void => {
//   e.preventDefault();
//   if (room !== "") {
//    socket.emit("join_room", room);
//   }
//  };
