import "./App.css";
import { ChangeEvent } from "react";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("http://localhost:3001");

//TODO: Fix react rendering upon state change causing new socket connection
function App() {
 const [room, setRoom] = useState("");
  
 const handleRoomInput = (e: ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  setRoom(e.target.value);
 };

 const joinRoom = () => {
  if (room !== "") {
   socket.emit("join_room", room);
  }
 };

 return (
  <>
   <h1>Hello</h1>
   <form>
    <input
     id="input"
     type="text"
     placeholder="Enter room no."
     onChange={handleRoomInput}
    ></input>
    <button onClick={joinRoom}> Join Room </button>
   </form>
  </>
 );
}

export default App;
