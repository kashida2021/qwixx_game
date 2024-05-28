import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/HomePage";
import Lobby from "./pages/Lobby/Lobby";
import socketService from "./services/socketServices";

function App() {
 const [roomId, setRoomId] = useState("");
 const [lobbyId, setLobbyId] = useState("");
 const [isLoading, setIsLoading] = useState(false);
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

 const connectSocket = () => {
  socketService.connect("http://localhost:3001");
  if (socketService) {
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
  // <>
  //  <h1>Hello</h1>
  //  <form>
  //  <input
  //    id="input"
  //    name="userId"
  //    type="text"
  //    placeholder="Enter UserId."
  //    onChange={handleInputChange(setUserId)}
  //   ></input>
  //   <input
  //    id="input"
  //    name="roomId"
  //    type="text"
  //    placeholder="Enter room no."
  //    onChange={handleInputChange(setRoomId)}
  //   ></input>
  //   <button onClick={joinRoom}> Join Room </button>
  //   <button onClick={LeaveRoom}> Leave Room </button>
  //   {error && <p>{error}</p>}
  //  </form>
  // </>
  <Router>
   <Routes>
    <Route
     path="/"
     element={<Home setLobbyId={setLobbyId} socketService={socketService} />}
    />
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
