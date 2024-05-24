// import { ChangeEvent, FormEvent } from "react";
import "./HomePage.css";
import {
 useState,
 MouseEvent,
 useEffect,
 SetStateAction,
 Dispatch,
} from "react";
import { Modal } from "../components/modal/Modal";
import socketService from "../services/socketServices";
import { useNavigate } from "react-router-dom";

// interface FuncProps {
//     handleRoomInput(arg:ChangeEvent<HTMLInputElement>):void;
//     handleJoinRoom(arg:FormEvent<HTMLButtonElement>):void;
// }

// interface Props {
//  room: string;
//  setRoom: React.Dispatch<React.SetStateAction<string>>;
//  socket: Socket;
// }

//TODO:
//Need to handle "Create Lobby" button correctly
//Should randomly generate a lobby ID
//Set the "room" state with "setRoom"
//Emit socket event to socket server
//Navigate to lobby with url "/lobby/:room"
//Lobby should have "heading" with "Lobby" and "room(lobbyID)" somewhere visible

interface IHomeProps {
 setLobbyId: Dispatch<SetStateAction<string>>;
}

export const Home: React.FC<IHomeProps> = ({ setLobbyId }) => {
 const [modal, setModal] = useState(false);

 const navigate = useNavigate();
 const toggleModal = () => {
  setModal(!modal);
 };

 const handleCreateLobby = (e: MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  console.log("Client: HomePage - createLobby() called");
  socketService.emit("create_lobby");
 };

 useEffect(() => {
  console.log("Registering socket listener for create_lobby_success");
  socketService.on("create_lobby_success", (newLobbyId) => {
   console.log("Client: Received create_lobby_success event", newLobbyId);
   setLobbyId(newLobbyId);
   navigate(`/lobby/${newLobbyId}`);
  });

  // Clean up the event listener when the component unmounts
  return () => {
   console.log("Cleaning up socket listener for create_lobby_success");
   socketService.getSocket()?.off("create_lobby_success");
  };
 }, [setLobbyId, navigate]);

 return (
  <>
   <h1> Qwixx</h1>

   <button onClick={handleCreateLobby}>Create Lobby</button>

   <button onClick={toggleModal}>Join Lobby</button>

   {modal && <Modal toggleModal={toggleModal} />}
  </>
 );
};
export default Home;
