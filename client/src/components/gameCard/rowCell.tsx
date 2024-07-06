import React from 'react';

interface NumberCellProps{
    type:'number';
    num: number;
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
    
    return (<button className = {`cell-btn ${props.color}`}> 
            {props.num}
        </button>
    )
}

export default RowCell;