import "./App.css";
import { ChangeEvent, FormEvent } from "react";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://localhost:3001");

function App() {
 const [room, setRoom] = useState("");

 const handleRoomInput = (e: ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  setRoom(e.target.value);
 };

 //submitting form was re-rendering page. Added 'preventDefault'. 
 const joinRoom = (e: FormEvent<HTMLButtonElement>) => {
	e.preventDefault();
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
