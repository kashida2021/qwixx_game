import "./Modal.css";
import { ChangeEvent, useState, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import { Socket } from "socket.io-client";

interface IModalProps {
 setLobbyId: Dispatch<SetStateAction<string>>;
 toggleModal(): void;
 socket: Socket;
 userId: string;
}

export const Modal: React.FC<IModalProps> = ({
 toggleModal,
 socket,
 userId,
 setLobbyId,
}) => {
 const navigate = useNavigate();
 const [localLobbyId, setLocalLobbyId] = useState("");
 const [localErrorMessage, setLocalErrorMessage] = useState("");

 const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
  e.preventDefault();
  const inputValue = e.target.value;

  if (/^\d{0,4}$/.test(inputValue)) {
   setLocalLobbyId(inputValue);
  }
 };

 const handleJoinLobby = (e: FormEvent<HTMLFormElement>): void => {
  e.preventDefault();

  if (!localLobbyId || !userId) {
   setLocalErrorMessage("User ID and Lobby ID is required");
   return;
  }

  socket.emit(
   "join_lobby",
   { localLobbyId, userId },
   (response: {
    success: boolean;
    confirmedLobbyId: string;
    error: string;
   }) => {
    if (response.success) {
     setLocalErrorMessage("");
     setLobbyId(response.confirmedLobbyId);
     navigate(`/lobby/${response.confirmedLobbyId}`);
    } else {
     setLocalErrorMessage(response.error);
    }
   }
  );
 };

 return (
  <div className="modal">
   <div className="overlay"></div>
   <div className="modal-content">
    <h2>Enter the 4 digit lobby ID.</h2>
    <form onSubmit={handleJoinLobby}>
     <label htmlFor="lobbyIdInput">
      You can join a private lobby by filling in the four-digit lobby ID
      <input
       id="lobbyIdInput"
       type="text"
       onChange={handleInputChange}
       value={localLobbyId}
       placeholder="Lobby ID..."
      />
     </label>
     <button type="submit">Join Lobby</button>
     {localErrorMessage && <p>{localErrorMessage}</p>}
    </form>
    <button className="close-modal" onClick={toggleModal}>
     X
    </button>
   </div>
  </div>
 );
};

export default Modal;
