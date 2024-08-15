import React from "react";

interface RowProps {
  rowColour: string;
  rowIndex: number;
  numbers: number;
  isOpponent: boolean;
  gameCardData: any;
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

  const renderLockButton = () => {
    const isLocked = gameCardData.isLocked ? "locked" : "";

    return isOpponent ? (
      <li>
        <span
          className={`lock-btn ${rowColour} ${isLocked}`}
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
          disabled={gameCardData.isLocked}
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
          // console.log(num, numIndex);
          return (
            <li key={numIndex}>
              {isOpponent ? (
                <span
                  className={`cell-btn ${rowColour} ${classAttributes}`}
                  aria-label={"non-interactive-button"}
                >
                  {num}
                </span>
              ) : (
                <button
                  className={`cell-btn ${rowColour} ${classAttributes}`}
                  aria-label={"interactive-button"}
                  disabled={isClicked}
                  value={num}
                >
                  {num}
                </button>
              )}
            </li>
          );
        })}
        ;{renderLockButton()}
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
