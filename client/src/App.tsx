import "./App.css";
import { useEffect, ChangeEvent, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/HomePage";
import Lobby from "./pages/Lobby/Lobby";
import socketService from "./services/socketServices";

function App() {
 const [lobbyId, setLobbyId] = useState("");
 const [userId, setUserId] = useState("");
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState("");

 //Need to consier if this is overkill for our app as it's only being used in one place. 
 const handleInputChange =
  (setter: React.Dispatch<React.SetStateAction<string>>) =>
  (e: ChangeEvent<HTMLInputElement>) => {
   e.preventDefault();
   setter(e.target.value);
  };

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
   setIsLoading(false);
  }
 };

 useEffect(() => {
  connectSocket();
 }, []);

 if (isLoading) {
  return <div>Loading...</div>;
 }

 return (
  <Router>
   <Routes>
    <Route
     path="/"
     element={
      <Home
       socketService={socketService} //Used throughout the application
       lobbyId={lobbyId} //Doesn't get used in Home => Used in Modal & Lobby
       setLobbyId={setLobbyId} //Used in both home and modal
       userId={userId} //Used in both home and modal
       setUserId={setUserId} //Used in home
       handleInputChange={handleInputChange} //Used in Home and modal, is it better than writing "handleInputChange" in the component?
       error={error} // Maybe don't need this so high up
       setError={setError} //Maybe don't need this so high up
      />
     }
    />
    <Route path={`/lobby/${lobbyId}`} element={<Lobby lobbyId={lobbyId} />} />
   </Routes>
  </Router>
 );
}

export default App;
