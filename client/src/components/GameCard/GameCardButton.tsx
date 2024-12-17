// NOTE:
// Button states:
//  1. Enabled: Can be clicked - disabled = false, empty CSS class
//  2. Clicked: Clicked by a player - disabled = true, 'clicked' CSS class
//  3. Disabled: - disabled = true, 'disabled' CSS class
//    - Happens when a row has been locked
//    - A higher marked number makes it disabled.

type NumberButtonProps = {
  type: "num-btn";
  label: number;
  rowColour: string;
  isOpponent: boolean;
  isDisabled: boolean;
  classAttributes: string;
  eventHandler: (rowColour: string, num: number) => void;
}

type LockButtonProps = {
  type: "lock-btn";
  label: React.ReactNode;
  rowColour: string;
  isOpponent: boolean;
  isDisabled: boolean;
  classAttributes: string;
  eventHandler: (rowColour: string,) => void;
}

type ButtonProps = NumberButtonProps | LockButtonProps;

export const GameCardButton: React.FC<ButtonProps> = ({
  type,
  label,
  rowColour,
  isOpponent,
  isDisabled,
  classAttributes,
  eventHandler,
}) => {
  const buttonType = type === "num-btn" ? 'num-btn' : 'lock-btn'

  const handleClick = () => {
    if (type === "num-btn") {
      eventHandler(rowColour, label)
    }
    else if (type === "lock-btn") {
      eventHandler(rowColour)
    };
  }

  return (
    <li>
      {isOpponent ? (
        <span
          className={`${buttonType} ${rowColour} ${classAttributes}`}
          aria-label="non-interactive-button"
        >
          {label}
        </span>
      ) : (
        <button
          className={`${buttonType} ${rowColour} ${classAttributes}`}
          aria-label="interactive-button"
          disabled={isDisabled}
          onClick={handleClick}
        >
          {label}
        </button>
      )}
    </li>
  );
}
