import React from "react";

interface RowProps {
  rowColour: string;
  rowIndex: number;
  numbers: number;
  isOpponent: boolean;
}

const Row: React.FC<RowProps> = ({
  rowColour,
  rowIndex,
  numbers,
  isOpponent,
}) => {
  const buttonNumbers =
    rowIndex < 2
      ? Array.from({ length: numbers }, (_, i) => i + 2)
      : Array.from({ length: numbers }, (_, i) => numbers + 1 - i);

  const renderRows = () => {
    return isOpponent ? (
      <ol className={`row ${rowColour}`} aria-label={`row-${rowColour}`}>
        {buttonNumbers.map((num, numIndex) => (
          <li key={numIndex}>
            <span className={`cell-btn ${rowColour}`} aria-label="fake-button">{num}</span>
          </li>
        ))}
        <li>
          <span className={`lock-btn ${rowColour}`} aria-label="fake-button">🔒</span>
        </li>
      </ol>
    ) : (
      <ol className={`row ${rowColour}`} aria-label={`row-${rowColour}`}>
        {buttonNumbers.map((num, numIndex) => (
          <li key={numIndex}>
            <button className={`cell-btn ${rowColour}`}>{num}</button>
          </li>
        ))}
        <li>
          <button className={`lock-btn ${rowColour}`}>🔒</button>
        </li>
      </ol>
    );
  };

  return (
   <>{renderRows()}</>
  );
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
