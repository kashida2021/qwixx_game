interface ICellLockButton {
  colour: string;
  isOpponent: boolean;
  handleLockRow: (rowColour: string) => void;
  isLocked: boolean;
}
// NOTE: 
// Shouldn' the lock button be disabled if the conditions aren't met?
// And then enabled when the conditions are met
// And then disabled again when it's been clicked?
// Also, there are 2 different CSS classes that should be applied "clicked" & "disabled". Something along those lines
// Button states:
//  -enabled: Can be clicked - disabled = false, empty CSS class
//  -clicked: Clicked by a player - clicked CSS class
//  -disabled: - disabled = true, disabled CSS class
//    1. The conditions have not yet been met
//    2. The row is already locked

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
