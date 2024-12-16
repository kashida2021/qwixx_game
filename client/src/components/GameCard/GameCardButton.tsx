// NOTE:
// Button states:
//  -enabled: Can be clicked - disabled = false, empty CSS class
//  -clicked: Clicked by a player - disabled = true, clicked CSS class
//  -disabled: - disabled = true, disabled CSS class
//    1. The row has been locked
//    2. Another clicked number makes this number inactive.

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
  const buttonType = type === "num-btn" ? 'number-btn' : 'lock-btn'

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
          aria-label="interactive-lock-button"
          disabled={isDisabled}
          onClick={handleClick}
        >
          {label}
        </button>
      )}
    </li>
  );
}
