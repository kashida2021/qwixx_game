//import React, {
//ChangeEvent,
//ChangeEventHandler,
//MouseEvent,
//useEffect,
//useState,
//} from "react";
import { GameCardData } from "../../types/GameCardData";
import { RowColour } from "../../types/enums";
import CellButton from "./CellButton";
import { LockButton } from "./CellLockButton";

interface RowProps {
  rowColour: RowColour;
  rowIndex: number;
  numbers: number;
  isOpponent: boolean;
  gameCardData: GameCardData;
  cellClick: (rowColour: string, num: number) => void;
  handleLockRow: (rowColour: string) => void;
}

//locked button is always disabled.
//It's enabled when 12 is clicked.
//When lock is clicked, all buttons of the row become disabled.

const Row: React.FC<RowProps> = ({
  rowColour,
  rowIndex,
  numbers,
  isOpponent,
  cellClick,
  gameCardData,
  handleLockRow,
}) => {
  // const [locked, setLocked] = useState(false);

  const buttonNumbers =
    rowIndex < 2
      ? Array.from({ length: numbers }, (_, i) => i + 2) // 11 -> [2,3,4,5,6,7,8,9,10,11,12][lock btn]
      : Array.from({ length: numbers }, (_, i) => numbers + 1 - i); // 11 -> [12,11,10,9,8,7,6,5,4,3,2]

  //If game state dictates that the row is locked
  // useEffect(() => {
  //   if (gameCardData.isLocked[rowColour]) {
  //     setLocked(true);
  //   }
  // }, [gameCardData, rowColour]);

  const renderRow = () => {

    const markedNumbers = gameCardData.rows[rowColour] || [];
    const maxMarkedNumber = markedNumbers.length > 0 ? Math.max(...markedNumbers) : undefined
    const minMarkedNumber = markedNumbers.length > 0 ? Math.min(...markedNumbers) : undefined

    return (
      <ol className={`row ${rowColour}`} aria-label={`row-${rowColour}`}>
        {buttonNumbers.map((num, numIndex) => {
          // const isDisabled = gameCardData[rowColour].includes(num) || locked;
          const isDisabled = gameCardData.rows[rowColour].includes(num);

          let notValid = false;

          if (rowIndex < 2) {
            notValid = maxMarkedNumber !== undefined && num < maxMarkedNumber;
          } else {
            notValid = minMarkedNumber !== undefined && num > minMarkedNumber;
          }

          const classAttributes = isDisabled ? "clicked" : notValid ? "disabled" : "";

          return (
            <CellButton
              key={numIndex}
              rowColour={rowColour}
              clickAttributes={classAttributes}
              isOpponent={isOpponent}
              num={num}
              isClicked={isDisabled}
              cellClick={cellClick}
            />
          );
        })}
        <LockButton
          // locked={locked}
          colour={rowColour}
          isOpponent={isOpponent}
          handleLockRow={handleLockRow}
        // lockRow={setLocked}
        />
      </ol>
    );
  };

  return <>{renderRow()}</>;
};

export default Row;
