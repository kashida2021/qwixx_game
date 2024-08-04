import React from 'react';

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
        <ol className={`Row ${rowColour}`} aria-label={`row-${rowColour}`}>
            {buttonNumbers.map((num, numIndex) => (
                <li key={numIndex}>
                    <button className={`cell-btn ${rowColour}`}>
                        {num}
                    </button>
                </li>
            ))}
            <li>
                <button className={`lock-btn ${rowColour}`}>🔒</button>
            </li>
        </ol>
    )

}

export default Row;