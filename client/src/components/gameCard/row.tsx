import React from 'react';
import RowCell from './rowCell';

interface RowProps{
    rowColour: string; 
    rowIndex: number;
    numbers: number;
}

const Row:React.FC<RowProps> = ({rowColour, rowIndex, numbers}) => {

    const buttonNumbers = rowIndex < 2
    ? Array.from({ length: numbers }, (_, i) => i + 2)
    : Array.from({ length: numbers }, (_, i) => numbers + 1 - i);

    return (
        <div className={`Row ${rowColour}`}>
            {buttonNumbers.map((num, numIndex) => (
                <RowCell key={numIndex} type="number" color={rowColour} numIndex={numIndex} num={num} rowIndex={rowIndex} />
            ))}
        <RowCell type="lock" color={rowColour}/>
        </div>
    )

}

export default Row;