import React from 'react';

interface RowCellProps{
    num: {
        number: number;
        crossed: boolean;
    };
    numIndex: number;
    rowIndex: number;
}

const RowCell:React.FC<RowCellProps> = ({num, numIndex, rowIndex}) => {
    return (
        <div className = {`${num.crossed ? `crossed` : ``}`}> 
            {num.number}
        </div>
    )
}

export default RowCell;