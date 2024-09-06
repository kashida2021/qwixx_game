const Dice: React.FC<{ colour: string; colourKey: string, value: number }> = ({colour, colourKey, value}) => {
  const diceStyle = {
    backgroundColor: colour,
  };
  return <div aria-label={`${colourKey} dice`} style={diceStyle}>{value}</div>;
};

export default Dice;
