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

const Row: React.FC<RowProps> = ({
  rowColour,
  rowIndex,
  numbers,
  isOpponent,
  cellClick,
  gameCardData,
  handleLockRow,
}) => {

  const buttonNumbers =
    rowIndex < 2
      ? Array.from({ length: numbers }, (_, i) => i + 2) // 11 -> [2,3,4,5,6,7,8,9,10,11,12][lock btn]
      : Array.from({ length: numbers }, (_, i) => numbers + 1 - i); // 11 -> [12,11,10,9,8,7,6,5,4,3,2]

  const renderRow = () => {

    const markedNumbers = gameCardData.rows[rowColour] || [];
    const maxMarkedNumber = markedNumbers.length > 0 ? Math.max(...markedNumbers) : undefined
    const minMarkedNumber = markedNumbers.length > 0 ? Math.min(...markedNumbers) : undefined
    // TODO:
    // When a round is finished (all players have submitted), the locked rows state is
    // normalised across all players' game cards.
    // Pass in this boolean to the cell button and lock button component
    // Use that to disable the button
    const isLocked = gameCardData.isLocked[rowColour]

    return (
      <ol className={`row ${rowColour}`} aria-label={`row-${rowColour}`}>
        {buttonNumbers.map((num, numIndex) => {
          // const isDisabled = gameCardData[rowColour].includes(num) || locked;
          // TODO: 
          // Maybe it is more appropriate to rename this as "isClicked" rather than "isDisabled"
          // to distinguish between a button that is disabled because it has been clicked
          // and disabled because it is no longer valid or the row is locked
          const isClicked = gameCardData.rows[rowColour].includes(num);

          let notValid = false;

          if (rowIndex < 2) {
            notValid = maxMarkedNumber !== undefined && num < maxMarkedNumber;
          } else {
            notValid = minMarkedNumber !== undefined && num > minMarkedNumber;
          }

          // TODO: 
          // We are currently passing in the CSS class attribute from this row component 
          // to the button components. Is this a good way to do it?
          // If we are doing it here, then we would need to add the "isLocked" boolean to the list
          // ": isLocked ? "disabled
          // or we change "isClicked" to "isDisabled" and it's prop as { isDisabled || notValid || isLocked }
          // but we still need to distinguish whether the button was clicked or is diabled because it is no longer valid
          // 2 states / styles
          // clicked - clicked style
          // disabled - isLocked || notValid - disabled style
          const classAttributes = isClicked ? "clicked" : notValid ? "disabled" : isClicked ? "disabled" : "";

          return (
            <CellButton
              key={numIndex}
              rowColour={rowColour}
              clickAttributes={classAttributes}
              isOpponent={isOpponent}
              num={num}
              isClicked={isClicked}
              cellClick={cellClick}
            />
          );
        })}
        <LockButton
          // locked={locked}
          colour={rowColour}
          isOpponent={isOpponent}
          handleLockRow={handleLockRow}
          isLocked={isLocked}
        // lockRow={setLocked}
        />
      </ol>
    );
  };

  return <>{renderRow()}</>;
};

export default Row;
