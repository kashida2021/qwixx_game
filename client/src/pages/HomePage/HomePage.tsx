import "./HomePage.css";
import {
 useState,
 MouseEvent,
 useEffect,
 SetStateAction,
 Dispatch,
} from "react";
import { Modal } from "../../components/modal/Modal";
// import socketService from "../../services/socketServices";
import SocketService from "../../services/socketServices";
import { useNavigate } from "react-router-dom";

interface IHomeProps {
 setLobbyId: Dispatch<SetStateAction<string>>;
 socketService: typeof SocketService;
}

export const Home: React.FC<IHomeProps> = ({ setLobbyId, socketService }) => {
 const [modal, setModal] = useState(false);

 const navigate = useNavigate();
 const toggleModal = () => {
  setModal(!modal);
 };

 const handleCreateLobby = (e: MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  socketService.emit("create_lobby");
 };

 useEffect(() => {
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

   <button onClick={handleCreateLobby}>Create Lobby</button>

   <button onClick={toggleModal}>Join Lobby</button>

   {modal && <Modal toggleModal={toggleModal} />}
  </>
 );
};
export default Home;
