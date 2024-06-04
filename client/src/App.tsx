import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/HomePage";
import Lobby from "./pages/Lobby/Lobby";
import { socket } from "./services/socketServices";

function App() {
 const [isConnected, setIsConnected] = useState(socket.connected);
 const [lobbyId, setLobbyId] = useState("");
 const [userId, setUserId] = useState("");
 const [globalError, setGlobalError] = useState("");
 const [members, setMembers] = useState<string[]>([]);

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

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  return () => {
   socket.off("connect");
   socket.off("disconnect");
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
       members={members} 
       setMembers={setMembers}
      />
     }
    />
    <Route path={`/lobby/${lobbyId}`} element={<Lobby socket={socket} lobbyId={lobbyId} userId={userId} members={members} setMembers={setMembers}/>} />
   </Routes>
  </Router>
 );
}

export default App;
