import "./App.css";
// import { ChangeEvent, FormEvent } from "react";
import { io } from "socket.io-client";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage";
import Lobby from "./pages/Lobby";

const socket = io("http://localhost:3001");

function App() {
 const [room, setRoom] = useState("");

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

 return (
  <Router>
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/lobby" element={<Lobby />} />
   </Routes>
  </Router>
 );
}

export default App;
