import Die from "./Die";
import React, {useState, useEffect} from "react";
import { DiceColours } from "../../types/enums";
import { Socket } from "socket.io-client";
import "./DiceContainer.css"
import { QwixxLogic } from "../../types/qwixxLogic";

const DiceContainer: React.FC<{ diceState: Record<string, number>, socket: Socket, lobbyId: string, gameState: QwixxLogic, userId: string }> = ({
  diceState, socket, lobbyId, gameState, userId
}) => {
  const [hasRolled, setHasRolled] = useState(false);

  const diceEntries = Object.entries(diceState);
  
	const colourMap: Record<string, string> = {
    white1: DiceColours.White,
    white2: DiceColours.White,
    red: DiceColours.Red,
    yellow: DiceColours.Yellow,
    green: DiceColours.Green,
    blue: DiceColours.Blue,
  };

	const handleDiceRoll = (): void =>  {
		socket.emit("roll_dice", {lobbyId});	
    setHasRolled(true);
	}
  
  const isActivePlayer = gameState.activePlayer === userId;

  useEffect(()=> {
    setHasRolled(false);
  }, [gameState.activePlayer]);
  
  return (
    <div className="dice-container">
      {diceEntries.map(([colourKey, value]) => (
        <Die key={colourKey} colour={colourMap[colourKey]} colourKey={colourKey} value={value}/>
      ))}
      <button onClick={handleDiceRoll} disabled={!isActivePlayer || hasRolled}>Roll Dice</button>
    </div>
  );
};

export default DiceContainer;
