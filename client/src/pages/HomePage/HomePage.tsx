import "./HomePage.css";
import {
 useState,
 MouseEvent,
 useEffect,
 SetStateAction,
 Dispatch,
 ChangeEvent,
} from "react";
import { Modal } from "../../components/modal/modal";
// import socketService from "../../services/socketServices";
import SocketService from "../../services/socketServices";
import { useNavigate } from "react-router-dom";

interface IHomeProps {
 socketService: typeof SocketService;
 lobbyId: string;
 setLobbyId: Dispatch<SetStateAction<string>>;
 userId: string;
 setUserId: Dispatch<SetStateAction<string>>;
 handleInputChange: (
  setter: React.Dispatch<React.SetStateAction<string>>
 ) => (e: ChangeEvent<HTMLInputElement>) => void;
 error: string;
 setError: Dispatch<SetStateAction<string>>;
}

export const Home: React.FC<IHomeProps> = ({
 lobbyId,
 setLobbyId,
 socketService,
 userId,
 handleInputChange,
 setUserId,
}) => {
 const [modal, setModal] = useState(false);

 const navigate = useNavigate();
 const toggleModal = () => {
  setModal(!modal);
 };

 const handleCreateLobby = (e: MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  socketService.emit("create_lobby", userId);
 };

 useEffect(() => {
  //Can this be a callback?
  socketService.on("create_lobby_success", (newLobbyId) => {
   setLobbyId(newLobbyId);
   navigate(`/lobby/${newLobbyId}`);
  });

  // Clean up the event listener when the component unmounts
  return () => {
   socketService.off("create_lobby_success");
  };
 }, [setLobbyId, navigate, socketService]);

 return (
  <>
   <h1> Qwixx</h1>
   <form>
    <input
     id="input"
     name="userId"
     type="text"
     placeholder="Enter UserId."
     onChange={handleInputChange(setUserId)}
    ></input>
   </form>

   <button onClick={handleCreateLobby}>Create Lobby</button>

   <button onClick={toggleModal}>Join Lobby</button>

   {modal && (
    <Modal
     setLobbyId={setLobbyId}
     toggleModal={toggleModal}
     socketService={socketService}
     lobbyId={lobbyId}
     userId={userId}
    />
   )}
  </>
 );
};
export default Home;
