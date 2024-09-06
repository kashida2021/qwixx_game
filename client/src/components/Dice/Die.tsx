import "./Die.css";

const Pip = ({ color }) => {
  return <span className="pip" style={{ backgroundColor: color }} />;
};


const Face = ({ children, backgroundColor, colourKey }) => (
  <div aria-label={`${colourKey} die`}className={`face dice ${backgroundColor}`} >
    {children}
  </div>
);

const Die: React.FC<{ colour: string; colourKey: string; value: number }> = ({
  colour,
  colourKey,
  value,
}) => {

  const pipColour = colour === 'white' ? '#333' : '#fff';

  const pips = Number.isInteger(value)
    ? Array(value)
        .fill(0)
        .map((_, i) => <Pip key={i} color={pipColour} />)
    : null;
  
  return <Face backgroundColor={colour} colourKey={colourKey}>{pips}</Face>;
};

export default Die;
