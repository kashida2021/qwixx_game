import React, {
  ChangeEvent,
  ChangeEventHandler,
  MouseEvent,
  useEffect,
  useState,
} from "react";
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
}

//locked button is always disabled.
//It's enabled when 12 is clicked.
//When lock is clicked, all buttons of the row become disabled.

const Row: React.FC<RowProps> = ({
  rowColour,
  rowIndex,
  numbers,
  isOpponent,
  gameCardData,
}) => {
  const [locked, setLocked] = useState(false);

  const buttonNumbers =
    rowIndex < 2
      ? Array.from({ length: numbers }, (_, i) => i + 2) // 11 -> [2,3,4,5,6,7,8,9,10,11,12][lock btn]
      : Array.from({ length: numbers }, (_, i) => numbers + 1 - i); // 11 -> [12,11,10,9,8,7,6,5,4,3,2]

  //If game state dictates that the row is locked
  useEffect(() => {
    if (gameCardData.isLocked[rowColour]) {
      setLocked(true);
    }
  }, [gameCardData, rowColour]);

  const renderRow = () => {
    return (
      <ol className={`row ${rowColour}`} aria-label={`row-${rowColour}`}>
        {buttonNumbers.map((num, numIndex) => {
          const isDisabled = gameCardData[rowColour].includes(num) || locked;

          const classAttributes = isDisabled ? "clicked" : "";

          return (
            <CellButton
              key={numIndex}
              rowColour={rowColour}
              clickAttributes={classAttributes}
              isOpponent={isOpponent}
              num={num}
              isClicked={isDisabled}
            />
          );
        })}
        <LockButton
          locked={locked}
          colour={rowColour}
          isOpponent={isOpponent}
          lockRow={setLocked}
        />
      </ol>
    );
  };

  return <>{renderRow()}</>;
};

export default Row;
