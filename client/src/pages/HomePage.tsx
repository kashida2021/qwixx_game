// import { ChangeEvent, FormEvent } from "react";
import "./HomePage.css";
import { useState, MouseEvent } from "react";
import { Modal } from "../components/modal/Modal";
import socketSerice from "../services/socketServices";

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
 createLobby(): void;
 lobbyId: string;
}

export const Home: React.FC<IHomeProps> = () => {
 const [modal, setModal] = useState(false);

 const toggleModal = () => {
  setModal(!modal);
 };

 const handleCreateLobby = (e: MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  console.log("HomePage - createLobby() called");
    socketSerice.emit("create_lobby")
 };

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
