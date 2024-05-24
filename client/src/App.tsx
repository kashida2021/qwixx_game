import "./App.css";
// import { ChangeEvent, FormEvent } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Lobby from "./pages/Lobby";
import socketService from "./services/socketServices";

// const socket = io("http://localhost:3001");

function App() {
 const [lobbyId, setLobbyId] = useState("");

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

 const connectSocket = () => {
    const socket = socketService.connect("http://localhost:3001"); 
 }; 

 
 useEffect(() => {
    connectSocket();
  }, []);

 return (
  <Router>
   <Routes>
    <Route
     path="/"
     element={<Home/>}
    />
    <Route path="/lobby" element={<Lobby lobbyId={lobbyId} />} />
   </Routes>
  </Router>
 );
}

export default App;
