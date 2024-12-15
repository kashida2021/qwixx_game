import { useState } from "react"; //re-add useEffect here later

// NOTE:
// Button states:
//  -enabled: Can be clicked - disabled = false, empty CSS class
//  -clicked: Clicked by a player - clicked CSS class
//  -disabled: - disabled = true, disabled CSS class
//    1. The row has been locked
//    2. Another clicked number makes this number inactive.
//
// TODO: 
// - pass in a isLocked prop
//    -use that prop to disable a button
// - This component and LockButton is actually very similar
//    - It might be possible to combine both components
//    - Instead of passing in a prop called "num", maybe call it "label"
//    - Then it can either be number or a lock icon.

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
  //const [isDisabled, setIsDisabled] = useState(isClicked);

  const notValid = clickAttributes === "disabled";


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
          disabled={isClicked || notValid}
          onClick={handleClick}
        >
          {num}
        </button>
      )}
    </li>
  );
};

export default CellButton;
