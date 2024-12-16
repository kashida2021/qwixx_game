import { GameCardData } from "../../types/GameCardData";
import { RowColour } from "../../types/enums";
import { GameCardButton } from "./GameCardButton";

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

  // NOTE:
  // A button has 3 'states' that affect the CSS styling:
  // 1. Enabled - has yet to be disabled by marking a higher marked number or the row is yet to be locked
  // 2. Disabled - when a higher number value has been marked or the row is locked
  // 3. Clicked - when a player has clicked on that specific number
  const getNumberButtonState = (num: number) => {
    const markedNumbers = gameCardData.rows[rowColour] || [];
    const maxMarkedNumber = markedNumbers.length > 0 ? Math.max(...markedNumbers) : undefined
    const minMarkedNumber = markedNumbers.length > 0 ? Math.min(...markedNumbers) : undefined

    const isClicked = gameCardData.rows[rowColour].includes(num);

    const notValid =
      rowIndex < 2
        ? maxMarkedNumber !== undefined && num < maxMarkedNumber
        : minMarkedNumber !== undefined && num > minMarkedNumber

    const isDisabled = isClicked || notValid
    const classAttributes = isClicked ? "clicked" : notValid ? "disabled" : "";

    return { isDisabled, classAttributes }
  }

  // NOTE:
  // When a round is finished (all players have submitted),
  // the locked rows state is normalised across all players' game cards.
  // The lock button is disabled when
  //  - default
  //  - when player locks a row (should have "clicked" CSS class)
  //  - when another player locks a row and the round has ended (should have "disabled" CSS class)
  // The lock button is enabled when
  //  - player has marked 5 numbers and the number 12
  //  - and the row isn't already locked
  //  - (shouldn't have any special CSS class)
  const getLockButtonState = () => {
    const isEnabled =
      !gameCardData.isLocked[rowColour] &&
      gameCardData.rows[rowColour].length >= 6 &&
      (rowIndex < 2
        ? gameCardData.rows[rowColour].includes(12)
        : gameCardData.rows[rowColour].includes(2)
      )

    const isClicked =
      gameCardData.isLocked[rowColour] &&
      ((rowIndex < 2 && gameCardData.rows[rowColour].includes(13)) ||
        (rowIndex >= 2 && gameCardData.rows[rowColour].includes(1))
      )

    const isDisabled = !isEnabled || isClicked
    const cssAttributes = isClicked ? "clicked" : !isEnabled ? "disabled" : ""

    return { isDisabled, cssAttributes }
  }

  const renderNumberButtons = () => {
    return buttonNumbers.map((num, numIndex) => {
      const { isDisabled, classAttributes } = getNumberButtonState(num)

      return (
        <GameCardButton
          key={numIndex}
          type="num-btn"
          label={num}
          rowColour={rowColour}
          isOpponent={isOpponent}
          isDisabled={isDisabled}
          classAttributes={classAttributes}
          eventHandler={cellClick}
        />
      );
    })
  }

  const renderLockButon = () => {
    const { isDisabled, cssAttributes } = getLockButtonState()
    return (
      <GameCardButton
        type="lock-btn"
        label="🔒"
        rowColour={rowColour}
        isOpponent={isOpponent}
        isDisabled={isDisabled}
        classAttributes={cssAttributes}
        eventHandler={handleLockRow}
      />
    )
  }

  return (
    <ol className={`row ${rowColour}`} aria-label={`row-${rowColour}`}>
      {renderNumberButtons()}
      {renderLockButon()}
    </ol>
  );
};

export default Row;
