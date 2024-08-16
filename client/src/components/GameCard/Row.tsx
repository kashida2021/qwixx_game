import React, { ChangeEvent, ChangeEventHandler, MouseEvent } from "react";
import { GameCardData } from "../../types/GameCardData";
import { RowColour } from "../../types/enums";
import CellButton from "./CellButton";

interface RowProps {
  rowColour: RowColour;
  rowIndex: number;
  numbers: number;
  isOpponent: boolean;
  gameCardData: GameCardData;
}

const Row: React.FC<RowProps> = ({
  rowColour,
  rowIndex,
  numbers,
  isOpponent,
  gameCardData,
}) => {
  const buttonNumbers =
    rowIndex < 2
      ? Array.from({ length: numbers }, (_, i) => i + 2) // 12 -> [2,3,4,5,6,7,8,9,10,11,12]
      : Array.from({ length: numbers }, (_, i) => numbers + 1 - i); // 11 -> [12,11,10,9,8,7,6,5,4,3,2]

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.target.disabled = true;
  };

  const renderLockButton = () => {
    // const isLocked = gameCardData.isLocked ? "locked" : "";
    const isLocked = gameCardData.lockedRows.includes(rowColour);

    return isOpponent ? (
      <li>
        <span
          className={`lock-btn ${rowColour} ${isLocked ? "locked" : ""}`}
          aria-label={"non-interactive-button"}
        >
          🔒
        </span>
      </li>
    ) : (
      <li>
        <button
          className={`lock-btn ${rowColour}`}
          aria-label={"button"}
          disabled={isLocked}
        >
          🔒
        </button>
      </li>
    );
  };

  const renderRow = () => {
    return (
      <ol className={`row ${rowColour}`} aria-label={`row-${rowColour}`}>
        {buttonNumbers.map((num, numIndex) => {
          const isClicked = gameCardData[rowColour].includes(num);

          const classAttributes = isClicked ? "clicked" : "";

          return (
            <CellButton
              key={numIndex}
              rowColour={rowColour}
              clickAttributes={classAttributes}
              isOpponent={isOpponent}
              num={num}
              isClicked={isClicked}
            />
          );
        })}
        {renderLockButton()}
      </ol>
    );
  };

  return <>{renderRow()}</>;
};

export default Row;

// const renderButtons = (color: string) => {
//   return Array.from({ length: numbers }, (_, index) => {
//     const isClicked = gameCardData[color].includes(index + 2); // Check if button is clicked
//     return (
//       <button
//         key={index}
//         className={`button ${isClicked ? "clicked" : ""}`}
//         disabled={isClicked} // Disable the button if already clicked
//       >
//         {index + 2}
//       </button>
//     );
//   });
// };
