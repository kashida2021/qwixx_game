import {useState} from 'react';

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
}

export default GameCard;