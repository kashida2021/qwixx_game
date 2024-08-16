import { useState } from "react";

interface ICellButton {
  rowColour: string;
  clickAttributes: string;
  isOpponent: boolean;
  num: number;
  isClicked: boolean;
}

const CellButton: React.FC<ICellButton> = ({
  rowColour,
  clickAttributes,
  isOpponent,
  num,
  isClicked,
}) => {
  const [isDisabled, setIsDisabled] = useState(isClicked);

  const handleClick = () => {
    setIsDisabled(!isDisabled);
  };

  return (
    <li>
      {isOpponent ? (
        <span
          className={`cell-btn ${rowColour} ${clickAttributes}`}
          aria-label="non-interactive-button"
        >
          {num}
        </span>
      ) : (
        <button
          className={`cell-btn ${rowColour} ${clickAttributes}`}
          aria-label="interactive-button"
          disabled={isDisabled}
          onClick={handleClick}
        >
          {num}
        </button>
      )}
    </li>
  );
};

export default CellButton;
