//import { useEffect, useState } from "react";

interface ICellLockButton {
  // locked: boolean;
  colour: string;
  isOpponent: boolean;
  // lockRow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LockButton: React.FC<ICellLockButton> = ({
  // locked,
  colour,
  isOpponent,
  // lockRow,
}) => {
  // const [isLocked, setIsLocked] = useState(locked);
  
  // const handleClick = () => {
  //   lockRow(true);
  // };

  // useEffect(() => {
  //   setIsLocked(!locked);
  // }, [locked]);

  return (
    <li>
      {isOpponent ? (
        <span
          // className={`lock-btn ${colour} ${isLocked ? "locked" : ""}`}
          className={`lock-btn ${colour}`}
          aria-label="non-interactive-button"
        >
          🔒
        </span>
      ) : (
        <button
          // className={`lock-btn ${colour} ${isLocked ? "locked" : ""}`}
          className={`lock-btn ${colour}`}
          aria-label="interactive-lock-button"
          // disabled={isLocked}
          // onClick={handleClick}
        >
          🔒
        </button>
      )}
    </li>
  );
};
