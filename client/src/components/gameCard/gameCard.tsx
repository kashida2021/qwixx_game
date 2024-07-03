import {useState} from 'react';
import Row from './row';

const rowColours: string[] = ["red", "yellow", "green", "blue"];
const ascendingNumbers:{number:number; crossed: boolean}[] = Array.from({ length: 11 }, (_, i) => ({ number: i + 2, crossed: false }));
const descendingNumbers:{number:number; crossed: boolean}[] = Array.from({ length: 11 }, (_, i) => ({ number: 12 - i, crossed: false }));

interface RowNumber {
    number: number;
    crossed: boolean;
  }
  
  interface Row {
    color: string;
    numbers: RowNumber[];
  }

const initialState: Row[] = rowColours.map((color, index) => ({
    color,
    numbers: index < 2 ? ascendingNumbers: descendingNumbers
}));

const GameCard = () => {
    const [rows, setRows] = useState<Row[]>(initialState);

    return (
        <div className="gameCard">
            {rows.map((row, rowIndex) => (
                <Row key={rowIndex} rowIndex={rowIndex} row={row}  />
            ))}
        </div>
    )
}

export default GameCard;