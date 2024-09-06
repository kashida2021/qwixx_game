import Dice from "./Dice";
import { DiceColours } from "../../types/enums";
import { Socket } from "socket.io-client";

const DiceContainer: React.FC<{ diceState: Record<string, number>, socket: Socket, lobbyId: string, }> = ({
  diceState, socket, lobbyId,
}) => {
	//TODO: When the other PR gets merged, we won't need to use ".dice"
  const diceEntries = Object.entries(diceState.dice);
  
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
    <div>
      {diceEntries.map(([colourKey, value]) => (
        <Dice key={colourKey} colour={colourMap[colourKey]} colourKey={colourKey} value={value}/>
      ))}
      <button onClick={handleDiceRoll}>Roll Dice</button>
    </div>
  );
};

export default DiceContainer;
