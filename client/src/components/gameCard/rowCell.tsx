import React from 'react';

interface NumberCellProps{
    type:'number';
    num: {
        number: number;
        crossed: boolean;
    };
    numIndex: number;
    rowIndex: number;
}

interface LockedCellProps{
    type: 'lock';
}

type CellProps = NumberCellProps | LockedCellProps;

const RowCell:React.FC<CellProps> = (props) => {
    if(props.type === "lock"){
            return <button>🔒</button>
        }
    
    return (<button className = {`${props.num.crossed ? `crossed` : ``}`}> 
            {props.num.number}
        </button>
    )
}

export default RowCell;