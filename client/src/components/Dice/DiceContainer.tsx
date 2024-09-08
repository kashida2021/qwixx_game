import Die from "./Die";
import { DiceColours } from "../../types/enums";
import { Socket } from "socket.io-client";
import "./DiceContainer.css"

const DiceContainer: React.FC<{ diceState: Record<string, number>, socket: Socket, lobbyId: string, }> = ({
  diceState, socket, lobbyId,
}) => {
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
	}

  return (
    <div className="dice-container">
      {diceEntries.map(([colourKey, value]) => (
        <Die key={colourKey} colour={colourMap[colourKey]} colourKey={colourKey} value={value}/>
      ))}
      <button onClick={handleDiceRoll}>Roll Dice</button>
    </div>
  );
};

export default DiceContainer;
