import React from 'react';
import RowCell from './rowCell';

interface RowNumber {
    number: number;
    crossed: boolean;
}

interface RowProps{
    row: {
        color: string;
        numbers: RowNumber[];

    };
    rowIndex: number;
}

const Row:React.FC<RowProps> = ({row, rowIndex}) => {
    return (
        <div className={`Row ${row.color}`}>
            {row.numbers.map((num, numIndex) => (
                <RowCell key={numIndex} numIndex={numIndex} num={num} rowIndex={rowIndex} />
            ))}
        </div>
    )

}

export default Row;