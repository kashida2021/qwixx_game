import { useEffect, useState } from "react";

interface ICellLockButton {
  locked: boolean;
  colour: string;
  isOpponent: boolean;
}

export const LockButton: React.FC<ICellLockButton> = ({
  locked,
  colour,
  isOpponent,
}) => {
  const [isLocked, setIsLocked] = useState(locked);

  const handleClick = () => {
    setIsLocked(!isLocked);
  };

  useEffect(() => {
    setIsLocked(locked);
  }, [locked]);

  return (
    <li>
      {isOpponent ? (
        <span
          className={`lock-btn ${colour} ${isLocked ? "locked" : ""}`}
          aria-label="non-interactive-button"
        >
          🔒
        </span>
      ) : (
        <button
          className={`lock-btn ${colour} ${isLocked ? "locked" : ""}`}
          aria-label="non-interactive-button"
          disabled={isLocked}
          onClick={handleClick}
        >
          🔒
        </button>
      )}
    </li>
  );
};
