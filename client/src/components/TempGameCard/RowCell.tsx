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
            return <li>
                    <button className={`lock-btn ${props.color}`}>🔒</button>
                </li>
        }
    
    return (
        <li>
            <button className = {`cell-btn ${props.color}`}> 
                {props.num}
            </button>
        </li>
    )
}

export default RowCell;