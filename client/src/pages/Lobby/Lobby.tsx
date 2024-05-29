interface Prop {
 lobbyId: string;
}
const Lobby: React.FC<Prop> = ({ lobbyId }) => {
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
  </>
 );
};

//Start game
//Navigates to game board/room
//Renders a game board
export default Lobby;
