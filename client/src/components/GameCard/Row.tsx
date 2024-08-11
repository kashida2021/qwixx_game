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

  const renderRows = (Component: keyof JSX.IntrinsicElements) => {
    const ariaLabel = Component === "span" ? "non-interactive-button" : "button";
  
    return (
      <ol className={`row ${rowColour}`} aria-label={`row-${rowColour}`}>
        {buttonNumbers.map((num, numIndex) => (
          <li key={numIndex}>
            <Component
              className={`cell-btn ${rowColour}`}
              aria-label={ariaLabel}
            >
              {num}
            </Component>
          </li>
        ))}
        <li>
          <Component
            className={`lock-btn ${rowColour}`}
            aria-label={ariaLabel}
          >
            🔒
          </Component>
        </li>
      </ol>
    );
  };

  return <>{isOpponent ? renderRows("span") : renderRows("button")}</>;
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
