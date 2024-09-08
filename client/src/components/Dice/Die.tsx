import "./Die.css";

interface IPipProps {
  colour: string;
}

interface IFaceProps {
  children: React.ReactNode;
  backgroundColour: string;
  colourKey: string;
}

interface IDieProps {
  colour: string;
  colourKey: string;
  value: number;
}

const Pip: React.FC<IPipProps> = ({ colour }) => {
  return (
    <span
      aria-label="die pip"
      className="pip"
      style={{ backgroundColor: colour }}
    />
  );
};

const Face: React.FC<IFaceProps> = ({
  children,
  backgroundColour,
  colourKey,
}) => (
  <div
    aria-label={`${colourKey} die`}
    className={`face dice ${backgroundColour}`}
  >
    {children}
  </div>
);

const Die: React.FC<IDieProps> = ({ colour, colourKey, value }) => {
  const pipColour = colour === "white" ? "#333" : "#fff";

  const pips = Number.isInteger(value)
    ? Array(value)
        .fill(0)
        .map((_, i) => <Pip key={i} colour={pipColour} />)
    : null;

  return (
    <Face backgroundColour={colour} colourKey={colourKey}>
      {pips}
    </Face>
  );
};

export default Die;
