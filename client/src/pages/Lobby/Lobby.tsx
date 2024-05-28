interface Prop {
 lobbyId: string;
}
const Lobby: React.FC<Prop> = ({ lobbyId }) => {
 return (
  <>
   <h1> Lobby </h1>
   <p>{lobbyId}</p>
  </>
 );
};

export default Lobby;
