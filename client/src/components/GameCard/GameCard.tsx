import Row from "./Row";
import "./GameCard.css";
//import { ChangeEvent } from "react"; //add useState later
import { GameCardData } from "../../types/GameCardData";
import { RowColour } from "../../types/enums";

const rowColours: RowColour[] = [RowColour.Red, RowColour.Yellow, RowColour.Green, RowColour.Blue];
const numbers: number = 11;

interface IGameCard {
  member: string;
  isOpponent: boolean;
  gameCardData: GameCardData;
  cellClick: (rowColour: string, num: number) => void;
  handleLockRow: (rowColour: string) => void;
}

const GameCard: React.FC<IGameCard> = ({ member, isOpponent, gameCardData, cellClick, handleLockRow }) => {
  const renderPenaltyCheckbox = (number: number) => {
    //console.log(gameCardData)
    const isPenaltyChecked = gameCardData.penalties?.includes(number);

    return isOpponent ? (
      <li>
        <span
          className={`penalty-checkbox ${isPenaltyChecked ? "checked" : ""}`}
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
          checked={isPenaltyChecked}
          disabled
          aria-label="penalty-checkbox"
        />
        <label htmlFor="">{number}</label>
      </li>
    );
  };

  return (
    <div className="qwixx-card" aria-label={`${member} card`}>
      <p>{member}</p>
      {rowColours.map((rowColour, rowIndex) => (
        <Row
          key={rowIndex}
          rowIndex={rowIndex}
          rowColour={rowColour}
          numbers={numbers}
          isOpponent={isOpponent}
          gameCardData={gameCardData}
          cellClick={cellClick}
          handleLockRow={handleLockRow}
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
