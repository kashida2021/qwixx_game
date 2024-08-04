import Row from './row';
import "./GameCard.css";
import {useState, ChangeEvent} from "react";


const rowColours: string[] = ["red", "yellow", "green", "blue"];
const numbers: number = 11;


const GameCard = () => {

    const [penalties, setPenalties] = useState<string[]>([]);

    const handlePenaltyChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPenalties((prevPenalties) => [...prevPenalties, value]);
        event.target.disabled = true;
    }

    return (
        <div className="gameCard">
            {rowColours.map((rowColour, rowIndex) => (
                <Row key={rowIndex} rowIndex={rowIndex} rowColour={rowColour} numbers={numbers}  />
            ))}
            <div className="penalties">
                <h3>Penalties</h3>
                <ul>
                    <li>
                        <input
                            type="checkbox"
                            id="penalty1"
                            value="Penalty_1"
                            onChange={handlePenaltyChange}
                        />
                        <label htmlFor="penalty1">1</label>
                    </li>
                    <li>
                    <input
                            type="checkbox"
                            id="penalty2"
                            value="Penalty_2"
                            onChange={handlePenaltyChange}
                        />
                        <label htmlFor="penalty2">2</label>
                    </li>
                    <li>
                    <input
                            type="checkbox"
                            id="penalty3"
                            value="Penalty_3"
                            onChange={handlePenaltyChange}
                        />
                        <label htmlFor="penalty3">3</label>
                    </li>
                    <li>
                    <input
                            type="checkbox"
                            id="penalty4"
                            value="Penalty_4"
                            onChange={handlePenaltyChange}
                        />
                        <label htmlFor="penalty1">4</label>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default GameCard;