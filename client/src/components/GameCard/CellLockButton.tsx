//import { useEffect, useState } from "react";

interface ICellLockButton {
  // locked: boolean;
  colour: string;
  isOpponent: boolean;
  // lockRow: React.Dispatch<React.SetStateAction<boolean>>;
  handleLockRow: (rowColour: string) => void;
}

export const LockButton: React.FC<ICellLockButton> = ({
  // locked,
  colour,
  isOpponent,
  handleLockRow,
  // lockRow,
}) => {
  // const [isLocked, setIsLocked] = useState(locked);

  // const handleClick = () => {
  //   lockRow(true);
  // };

  // TODO: Pass in prop to handle locking roll event?
  // useEffect(() => {
  //   setIsLocked(!locked);
  // }, [locked]);

  const handleClick = () => {
    handleLockRow(colour)
  }
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
          onClick={handleClick}
        >
          🔒
        </button>
      )}
    </li>
  );
};
