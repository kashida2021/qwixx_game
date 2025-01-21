import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/HomePage/HomePage";
import Lobby from "./pages/LobbyPage/LobbyPage";
import { socket } from "./services/socketServices";
// import GameBoard from "../../shared/GameBoard";
import Game from "./pages/GamePage/GamePage";
import { QwixxLogic } from "./types/qwixxLogic";
import { MoveAvailability } from "./types/GameCardData";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lobbyId, setLobbyId] = useState("");
  const [userId, setUserId] = useState("");
  //const [globalError, setGlobalError] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [gameState, setGameState] = useState<QwixxLogic | null>(null);
  const [gamePath, setGamePath] = useState("");
  const [availableMoves, setAvailableMoves] = useState<boolean>(false);
  const [isGameEnd, setIsGameEnd] = useState<boolean>(false);
  const [gameSummary, setGameSummary] = useState(null)
  const [isGameActive, setIsGameActive] = useState(false);

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

    const onPlayerJoined = (lobbyMembers: string[], user: string) => {
      setMembers(lobbyMembers);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `${user} has joined`,
      ]);
    };

    const onUserLeft = (lobbyMembers: string[], user: string) => {
      setMembers(lobbyMembers);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `${user} has left`,
      ]);
    };

    const onUserDisconnected = (lobbyMembers: string[], user: string) => {
      setMembers(lobbyMembers);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        `${user} has disconnected`,
      ]);
    };

    //    const currentMembers = (lobbyMembers: string[]) => {
    //      setMembers(lobbyMembers);
    //    };

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
      setIsGameActive(true);
      console.log(data.gameState);
    };

    const onUpdateMarkedNumbers = (data: { gameState: QwixxLogic }) => {
      setGameState(data.gameState);
      console.log("data received from backend", data);
    };

    const onTurnEnded = (data: { gameState: QwixxLogic }) => {
      console.log(gameState?.players)
      setGameState(data.gameState);
    }

    const onDiceRolled = (data: { diceValues: any, hasAvailableMoves: boolean, hasRolled: boolean }) => {
      setGameState((prevState) => {
        if (!prevState) {
          return {
            players: {},
            dice: data.diceValues,
            activePlayer: "",
            hasRolled: false
          };
        }

        return {
          ...prevState,
          dice: data.diceValues,
          hasRolled: data.hasRolled
        };
      });
      setAvailableMoves(data.hasAvailableMoves);
      console.log("move availability after dice roll", data.hasAvailableMoves);
      console.log("has dice been rolled", data.hasRolled);
      console.log("data after dice roll", data);
    };

    const onPenaltyProcessed = (data: { responseData: QwixxLogic }) => {
      setGameState(data.responseData)
      console.log("penalty data", data.responseData);
    }

    const handlePassMove = (data: { gameState: QwixxLogic }) => {
      setGameState(data.gameState);
      console.log(data.gameState);
    }

    const onRowLocked = (data: { gameState: QwixxLogic }) => {
      setGameState(data.gameState)
      console.log("Data after locking a row", data)
    }

    const onGameEnd = (data: { gameState: any }) => {
      setIsGameEnd(true)
      setGameSummary(data.gameState)
    }

    const onPlayAgain = ( data: {isGameActive: boolean}) => {
      setIsGameActive(data.isGameActive);
    }


    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("player_joined", onPlayerJoined);
    socket.on("user_left", onUserLeft);
    socket.on("user_disconnected", onUserDisconnected);
    //socket.on("current_members", currentMembers);
    // socket.on("gameBoard_created", createGameBoard);
    socket.on("game_initialised", onGameInitialised);
    socket.on("update_marked_numbers", onUpdateMarkedNumbers);
    socket.on("dice_rolled", onDiceRolled);
    socket.on("penalty_processed", onPenaltyProcessed);
    socket.on("row_locked", onRowLocked)
    socket.on("turn_ended", onTurnEnded);
    socket.on("passMoveProcessed", handlePassMove);
    socket.on("game_ended", onGameEnd);
    socket.on("playAgain_lobbyRedirect", onPlayAgain);

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
      socket.off("penalty_processed");
      socket.off("turn_ended");
      socket.off("passMoveProcessed");
      socket.off("row_locked");
      socket.off("game_ended");
      socket.off("playAgain_lobbyRedirect");
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
              isGameActive={isGameActive}
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
                isGameEnd={isGameEnd}
                gameSummary={gameSummary}
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
