import "./App.css";
import { ChangeEvent, FormEvent } from "react";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("http://localhost:3001");

function App() {
 const [roomId, setRoomId] = useState("");
 const [userId, setUserId] = useState("");
 const [error, setError] = useState("");

 socket.on("lobbyFull", () => {
  setError("Lobby is full");
 })

 const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
 (e: ChangeEvent<HTMLInputElement>) => {
  e.preventDefault();
  setter(e.target.value);
 };

 //submitting form was re-rendering page. Added 'preventDefault'. 
 const joinRoom = (e: FormEvent<HTMLButtonElement>) => {
	e.preventDefault();
  if(roomId && userId){
    socket.emit("join_room", {roomId, userId});
    setError("");
  } else{
    setError("UserId and RoomId is required");
  }
 };

 const LeaveRoom = (e: FormEvent<HTMLButtonElement>) => {
	e.preventDefault();
  if(roomId && userId){
    socket.emit("leave_room", {roomId, userId});
 }
}

 return (
  <>
   <h1>Hello</h1>
   <form>
   <input
     id="input"
     name="userId"
     type="text"
     placeholder="Enter UserId."
     onChange={handleInputChange(setUserId)}
    ></input>
    <input
     id="input"
     name="roomId"
     type="text"
     placeholder="Enter room no."
     onChange={handleInputChange(setRoomId)}
    ></input>
    <button onClick={joinRoom}> Join Room </button>
    <button onClick={LeaveRoom}> Leave Room </button>
    {error && <p>{error}</p>}
   </form>
  </>
 );
}

export default App;
