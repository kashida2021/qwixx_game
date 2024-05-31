import { Socket } from "socket.io-client";

interface Prop {
 socket: Socket;
 lobbyId: string;
 userId: string; 
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

const Lobby: React.FC<Prop> = ({socket, lobbyId, userId }) => {
 const LeaveRoom = (e: FormEvent<HTMLButtonElement>) => {
  e.preventDefault();
  if (lobbyId && userId) {
   socket.emit("leave_room", { lobbyId, userId });
  }
 };

 return (
  <>
   <h1> Lobby </h1>
   <p>{lobbyId}</p>
   {/* Show user ID's */}
  </>
 );
};

export default Lobby;
