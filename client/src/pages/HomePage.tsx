// import { ChangeEvent, FormEvent } from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { Socket } from "socket.io-client";

// interface FuncProps {
//     handleRoomInput(arg:ChangeEvent<HTMLInputElement>):void;
//     handleJoinRoom(arg:FormEvent<HTMLButtonElement>):void;
// }

// interface Props {
//  room: string;
//  setRoom: React.Dispatch<React.SetStateAction<string>>;
//  socket: Socket;
// }
// export const Home: React.FC<Props> = ({ room, setRoom, socket }) => {
//  const navigate = useNavigate();

//  const handleRoomInput = (e: ChangeEvent<HTMLInputElement>): void => {
//   e.preventDefault();
//   setRoom(e.target.value);
//  };

//  const joinRoom = (e: FormEvent<HTMLButtonElement>): void => {
//   e.preventDefault();
//   if (room !== "") {
//    socket.emit("join_room", room);
//   }
//   navigate("/lobby")
//  };

//  return (
//   <div>
//    <h1> Qwixx </h1>
//    <form>
//     <input
//      id="input"
//      type="text"
//      placeholder="Enter room no."
//      onChange={handleRoomInput}
//     ></input>
//     <p>Room:</p>
//     <p>{room}</p>
//     <button onClick={joinRoom}> Join Room </button>
//    </form>
//   </div>
//  );
// };

export const Home: React.FC = () => {
 const navigate = useNavigate();
 const [modal, setModal] = useState(false);

 const toggleModal = () => {
  setModal(!modal);
 };

 return (
  <>
   <h1> Qwixx</h1>

   <button
    onClick={() => {
     navigate("/lobby");
    }}
   >
    Create Lobby
   </button>

   <button onClick={toggleModal}>Join Lobby</button>

   {modal && (
    <div className="modal">
     <div className="overlay"></div>
     <div className="modal-content">
      <h2>Enter the 4 digit room ID.</h2>
      <input></input>
      <button>Join Lobby</button>
      <button className="close-modal" onClick={toggleModal}>
       X
      </button>
     </div>
    </div>
   )}
  </>
 );
};
export default Home;
