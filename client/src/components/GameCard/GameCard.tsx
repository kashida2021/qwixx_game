import Row from "./Row";
import "./GameCard.css";
import { useState, ChangeEvent } from "react";
import { GameCardData } from "../../types/GameCardData";
import { RowColour } from "../../types/enums";

const rowColours: RowColour[] = [RowColour.Red, RowColour.Yellow, RowColour.Green, RowColour.Blue];
const numbers: number = 11;

interface IGameCard {
  member: string;
  isOpponent: boolean;
  gameCardData: GameCardData;
}

const GameCard: React.FC<IGameCard> = ({ member, isOpponent, gameCardData }) => {
  //PLAYER ID ASSOCIATED TO EACH GAME CARD
  //That can be used along with row colour + number to send to server
  // const [penalties, setPenalties] = useState<string[]>([]);

  const handlePenaltyChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // setPenalties((prevPenalties) => [...prevPenalties, value]);
    event.target.disabled = true;
  };

  const renderPenaltyCheckbox = (number: number) => {
    return isOpponent ? (
      <li>
        <span
          className={`penalty-checkbox ${gameCardData.penalties ? "checked" : ""}`}
          aria-label="fake-checkbox"
        ></span>
        <label htmlFor="">{number}</label>
      </li>
    ) : (
      <li>
        <input
          type="checkbox"
          id={`penalty${number}`}
          value={`Penalty_${number}`}
          onChange={handlePenaltyChange}
          aria-label="penalty-checkbox"
        />
        <label htmlFor="">{number}</label>
      </li>
    );
  };

  return (
    <div className="game-card" aria-label={`${member} card`}>
      <p>{member}</p>
      {rowColours.map((rowColour, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          rowColour={rowColour}
          numbers={numbers}
          isOpponent={isOpponent}
          gameCardData={gameCardData}
        />
      ))}
      <div className="penalties-container">
        <h3>Penalties</h3>
        <ul className="penalties-list" aria-label="penalties-list">
          {renderPenaltyCheckbox(1)}
          {renderPenaltyCheckbox(2)}
          {renderPenaltyCheckbox(3)}
          {renderPenaltyCheckbox(4)}
        </ul>
      </div>
    </div>
  );
};

export default GameCard;