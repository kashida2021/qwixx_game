import Row from './row';
import "./GameCard.css";

const rowColours: string[] = ["red", "yellow", "green", "blue"];
const numbers: number = 11;


const GameCard = () => {

    return (
        <div className="gameCard">
            {rowColours.map((rowColour, rowIndex) => (
                <Row key={rowIndex} rowIndex={rowIndex} rowColour={rowColour} numbers={numbers}  />
            ))}
            <div className="penalties">
                <h3>Penalties</h3>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
            </div>
        </div>
    )
}

export default GameCard;