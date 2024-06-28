import "./Lobby.css";
import { Socket } from "socket.io-client";
import { SetStateAction, Dispatch, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

interface ILobbyProps {
  socket: Socket;
  lobbyId: string;
  userId: string;
  members: string[];
  setMembers: Dispatch<SetStateAction<string[]>>;
  notifications: string[];
  setNotifications: Dispatch<SetStateAction<string[]>>;
}

//The lobby page should:
//Show the lobby ID

//Show a list of user ID's that have joined the room
//This might require a state that is an array in App.tsx that's passed down as props
//an .on() event could setState of array.
//There is already a state for userID for this client.

//Check that there aren't more than 4 user ID's in the lobby. (If there are, something is wrong with server code)

//Have a button to leave room
//Leave Room button should leave the room and return back to HomePage
//One way to do this is through callback
//Make sure variable names of emitted data match server side variable names

//Have a button to start game (logic doesn't need to be implemented yet)

export const Lobby: React.FC<ILobbyProps> = ({
  socket,
  lobbyId,
  userId,
  members,
  notifications,
  setMembers,
  setNotifications,
}) => {
  const navigate = useNavigate();

  const leaveRoom = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (lobbyId && userId) {
      socket.emit(
        "leave_lobby",
        { lobbyId, userId },
        (response: { success: boolean }) => {
          if (response.success) {
            setNotifications([]);
            setMembers([]);
            navigate("/");
          }
        }
      );
    }
   });


 const startGame = (e: MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
  if (lobbyId && userId) {
   socket.emit("start_game", { lobbyId, userId }, (response: {success: boolean}) => {
    if(response.success){
        navigate(`/game/${lobbyId}`);
    }
   });
  }
 };

 return (
  <div className="Lobby-container">
    <div className="Lobby-message-board">
        <h2>Notifications</h2>
        <ul className="notifications-list" aria-label="notifications-list">
          {notifications.map((notification, index) => (
            <li key={index} className="notification-item">
              {notification}
            </li>
          ))}
        </ul>
      </div>
      <div className="Lobby-main-content">
        <h1> Qwixx Game </h1>
        <p>Lobby: {lobbyId}</p>
        <h2>Lobby Members</h2>
        <ul className="members-list" aria-label="members-list">
          {members.map((member, index) => (
            <li key={index} className="member-item">
              {member}
            </li>
          ))}
        </ul>
        <form>
          <button onClick={startGame}>Start Game</button>
          <button onClick={leaveRoom}>Leave Lobby</button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;
