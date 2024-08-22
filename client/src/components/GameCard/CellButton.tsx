import { useState } from "react"; //re-add useEffect here later

interface ICellButton {
  rowColour: string;
  clickAttributes: string;
  isOpponent: boolean;
  num: number;
  isClicked: boolean;
  cellClick: (rowColour: string, num: number) => void;
}

const CellButton: React.FC<ICellButton> = ({
  rowColour,
  clickAttributes,
  isOpponent,
  num,
  cellClick,
  isClicked,
}) => {
  const [isDisabled, setIsDisabled] = useState(isClicked);

  const handleClick = () => {
  console.log("clicked")
  cellClick(rowColour, num);
    //   setIsDisabled(!isDisabled);
  };

  // useEffect(() => {
  //   setIsDisabled(isClicked);
  // }, [isClicked]);

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
