import React from 'react';

interface NumberCellProps{
    type:'number';
    num: {
        number: number;
        crossed: boolean;
    };
    numIndex: number;
    rowIndex: number;
    color: string;
}

interface LockedCellProps{
    type: 'lock';
    color: string;
}

type CellProps = NumberCellProps | LockedCellProps;

const RowCell:React.FC<CellProps> = (props) => {
    if(props.type === "lock"){
            return <button className={`lock-btn ${props.color}`}>🔒</button>
        }
    
    return (<button className = {`${props.num.crossed ? `crossed cell-btn ${props.color}` : `cell-btn ${props.color}`}`}> 
            {props.num.number}
        </button>
    )
}

export default RowCell;