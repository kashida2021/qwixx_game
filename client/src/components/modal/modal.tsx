import "./Modal.css";
import { ChangeEvent, useState, Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import { Socket } from "socket.io-client";

interface funcProp {
 setLobbyId: Dispatch<SetStateAction<string>>;
 toggleModal(): void;
 socket: Socket;
 userId: string;
}

export const Modal: React.FC<funcProp> = ({
 toggleModal,
 socket,
 userId,
 setLobbyId,
}) => {
 const navigate = useNavigate();
 const [localLobbyId, setLocalLobbyId] = useState("");
 const [error, setError] = useState("");

 const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
  e.preventDefault();
  const inputValue = e.target.value;

  if (/^\d{0,4}$/.test(inputValue)) {
   setLocalLobbyId(inputValue);
  }
 };

 const handleJoinLobby = (e: FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
  if (localLobbyId && userId) {
   socket.emit(
    "join_lobby",
    { localLobbyId, userId },
    (confirmedLobbyId: string) => {
     setError("");
     setLobbyId(confirmedLobbyId);
     navigate(`/lobby/${confirmedLobbyId}`);
    }
   );
  } else {
   setError("UserId and lobbyId is required");
  }
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
    </form>
    <button className="close-modal" onClick={toggleModal}>
     X
    </button>
    {error && <p>{error}</p>}
   </div>
  </div>
 );
};

export default Modal;
