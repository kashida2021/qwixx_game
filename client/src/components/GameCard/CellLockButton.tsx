interface ICellLockButton {
  colour: string;
  isOpponent: boolean;
  handleLockRow: (rowColour: string) => void;
  isLocked: boolean;
}

export const LockButton: React.FC<ICellLockButton> = ({
  colour,
  isOpponent,
  handleLockRow,
  isLocked,
}) => {

  const handleClick = () => {
    handleLockRow(colour)
  }

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
          aria-label="interactive-lock-button"
          disabled={isLocked}
          onClick={handleClick}
        >
          🔒
        </button>
      )}
    </li>
  );
};
