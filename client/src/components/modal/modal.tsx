import "./Modal.css";
import {
 ChangeEvent,
 useState,
 useEffect,
 Dispatch,
 SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import SocketService from "../../services/socketServices";

interface funcProp {
 setLobbyId: Dispatch<SetStateAction<string>>;
 lobbyId: string;
 toggleModal(): void;
 socketService: typeof SocketService;
 userId: string;
}

export const Modal: React.FC<funcProp> = ({
 toggleModal,
 socketService,
 userId,
 lobbyId,
 setLobbyId,
}) => {
 const navigate = useNavigate();

 const [error, setError] = useState("");

 const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
  e.preventDefault();
  console.log(e.target.value);
  const inputValue = e.target.value;

  if (/^\d{0,4}$/.test(inputValue)) {
   setLobbyId(inputValue);
  }

 };

 //submitting form was re-rendering page. Added 'preventDefault'.
 const handleJoinLobby = (e: FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
  if (lobbyId && userId) {
   console.log(lobbyId);
   socketService.emit("join_lobby", { lobbyId, userId });
   setError("");
  } else {
   setError("UserId and lobbyId is required");
  }
 };

 useEffect(() => {
  socketService.on("lobby_full", () => {
   setError("Lobby is full");
  });

  //Can I use a call back on this?
  socketService.on("joined_lobby", (newLobbyId) => {
   navigate(`/lobby/${newLobbyId}`);
  });
  return () => {
    socketService.off("lobby_full")
    socketService.off("joined_lobby")
  }
 });
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
       value={lobbyId}
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
