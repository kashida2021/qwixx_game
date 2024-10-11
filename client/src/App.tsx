import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/HomePage";
import Lobby from "./pages/LobbyPage/LobbyPage";
import { socket } from "./services/socketServices";
// import GameBoard from "../../shared/GameBoard";
import Game from "./pages/GamePage/GamePage";
import { QwixxLogic } from "./types/qwixxLogic";
import { MoveAvailability} from "./types/GameCardData";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lobbyId, setLobbyId] = useState("");
  const [userId, setUserId] = useState("");
  //const [globalError, setGlobalError] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [gameState, setGameState] = useState<QwixxLogic | null>(null);
  const [gamePath, setGamePath] = useState("");
  const [availableMoves, setAvailableMoves] = useState<MoveAvailability>({});

  //Need to consier if this is overkill for our app as it's only being used in one place.
  //  const handleInputChange =
  //   (setter: React.Dispatch<React.SetStateAction<string>>) =>
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //    e.preventDefault();
  //    setter(e.target.value);
  //   };

  useEffect(() => {
    const onConnect = () => {
      console.log("connected to server");
      setIsConnected(true);
    };

    const onDisconnect = () => {
      console.log("disconnected from server");
      setIsConnected(false);
    };

    const handlePlayerJoined = (lobbyMembers: string[], user: string) => {
      setMembers(lobbyMembers);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `${user} has joined`,
      ]);
    };

    const handleUserLeft = (lobbyMembers: string[], user: string) => {
      setMembers(lobbyMembers);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `${user} has left`,
      ]);
    };

    const handleUserDisconnected = (lobbyMembers: string[], user: string) => {
      setMembers(lobbyMembers);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `${user} has disconnected`,
      ]);
    };

    const currentMembers = (lobbyMembers: string[]) => {
      setMembers(lobbyMembers);
    };

    // const createGameBoard = (data: GameBoard) => {
    //   const gameBoard = GameBoard.from(data);
    //   setGameBoardState(gameBoard);
    // };

    const onGameInitialised = (data: {
      path: string;
      gameState: QwixxLogic;
    }) => {
      // The received data object has a path property and players.
      // Players is an array of player objects that contain initial game card state.
      // We might need to use it for setting up the game cards on the front end.
      // If not, we can refactor the data object to not include it.
      setGamePath(data.path);
      setGameState(data.gameState);
      console.log(data.gameState);
    };

    const updateMarkedNumbers = (data: { gameState: QwixxLogic }) => {
      setGameState(data.gameState);
      console.log("data received from backend", data);
    };

    //const endTurn = (data: {gameState: QwixxLogic}) => {
      //setGameState(data.gameState);
      //console.log("turn ended", data );
    //}

    const handleDiceRolled = (data: { dice: QwixxLogic['dice'], moveAvailability: MoveAvailability }) => {
      setGameState((prevState) => {
        if (!prevState) {
          return {
            players: {},
            dice: data.dice,
            activePlayer: "",
          };
        }

        return {
          ...prevState,
          dice: data.dice,
        };
      });
      setAvailableMoves(data.moveAvailability);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("player_joined", handlePlayerJoined);
    socket.on("user_left", handleUserLeft);
    socket.on("user_disconnected", handleUserDisconnected);
    socket.on("current_members", currentMembers);
    // socket.on("gameBoard_created", createGameBoard);
    socket.on("game_initialised", onGameInitialised);
    socket.on("update_markedNumbers", updateMarkedNumbers);
    socket.on("dice_rolled", handleDiceRolled);
    //socket.on("turn_ended", endTurn);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("player_joined");
      socket.off("user_left");
      socket.off("user_disconnected");
      socket.off("current_members");
      // socket.off("gameBoard_created");
      socket.off("game_initialised");
      socket.off("update_markedNumbers");
      socket.off("dice_rolled");
      //socket.off("turn_ended");
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              socket={socket}
              isConnected={isConnected}
              setLobbyId={setLobbyId}
              userId={userId}
              setUserId={setUserId}
              setMembers={setMembers}
            />
          }
        />
        <Route
          path={`/lobby/${lobbyId}`}
          element={
            <Lobby
              socket={socket}
              lobbyId={lobbyId}
              userId={userId}
              members={members}
              setMembers={setMembers}
              notifications={notifications}
              setNotifications={setNotifications}
              gamePath={gamePath}
            />
          }
        />
        <Route
          path={`/game/${lobbyId}`}
          element={
            gameState ? (
              <Game
                socket={socket}
                lobbyId={lobbyId}
                userId={userId}
                members={members}
                gameState={gameState}
                availableMoves={availableMoves}
                // setGameBoardState={setGameBoardState}
              />
            ) : (
              <div>Loading...</div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
