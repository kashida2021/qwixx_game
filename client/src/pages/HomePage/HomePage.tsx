import "./HomePage.css";
import { useState, MouseEvent, SetStateAction, Dispatch } from "react";
import { Modal } from "../../components/modal/modal";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface IHomeProps {
 socket: Socket;
 isConnected: boolean;
 setLobbyId: Dispatch<SetStateAction<string>>;
 userId: string;
 setUserId: Dispatch<SetStateAction<string>>;
}

export const Home: React.FC<IHomeProps> = ({
 socket,
 isConnected,
 setLobbyId,
 userId,
 setUserId,
}) => {
 const [modal, setModal] = useState(false);
 const [localErrorMessage, setLocalErrorMessage] = useState("");

 const navigate = useNavigate();
 const toggleModal = () => {
  setModal(!modal);
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  e.preventDefault();
  const inputValue = e.currentTarget.value;
  setUserId(inputValue);
 };

 const handleCreateLobby = (e: MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  if (userId) {
   socket.emit("create_lobby", userId, (newLobbyId: string) => {
    setLobbyId(newLobbyId);
    setLocalErrorMessage("");
    navigate(`/lobby/${newLobbyId}`);
   });
  } else {
   setLocalErrorMessage("Please input user ID first");
  }
 };

 return (
  <>
   <h1> Qwixx</h1>
   <form>
    <input
     id="input"
     name="userId"
     type="text"
     placeholder="Enter UserId."
     value={userId}
     onChange={handleInputChange}
    ></input>
   </form>

   <button onClick={handleCreateLobby} disabled={!isConnected}>
    Create Lobby
   </button>

   <button onClick={toggleModal} disabled={!isConnected}>
    Join Lobby
   </button>
   {localErrorMessage && <p>{localErrorMessage}</p>}
   {modal && (
    <Modal
     setLobbyId={setLobbyId}
     toggleModal={toggleModal}
     socket={socket}
     userId={userId}
    />
   )}
  </>
 );
};
export default Home;
