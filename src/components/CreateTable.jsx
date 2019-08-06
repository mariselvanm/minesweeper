import React from 'react';
import './CreateTable.scss';

const createTable = props => {

    let tableContent = props.tablecontent.map((row, rowIndex) => {
        return <tr key={rowIndex}>
            {
                row.map((_, columnIndex) => {
                    let cellObj = props.tablecontent[rowIndex][columnIndex];
                    let value = null;
                    let addBombClass = '';

                    if ((cellObj.isShow && !cellObj.isFlaged) || props.showAllResult) {
                        if (cellObj.isBomb) {
                            value = '';
                            addBombClass = 'showBombs ';
                        } else {
                            value = cellObj.bombCount ? cellObj.bombCount : null;
                        }
                    }

                    let className = props.showAllResult ? 'show '.concat(addBombClass) : 
                                    ''.concat(cellObj.isShow ? 'show ' : '',
                                    cellObj.isFlaged ? 'flaged ' : '');

                    return <td 
                        className={className}
                        onClick={
                            !props.showAllResult ? 
                            () => props.clickListener(cellObj) :
                            null
                        }
                        onContextMenu={
                            !props.showAllResult ? 
                            (event) => props.rightclickListener(cellObj, event) :
                            null
                        }
                        key={''+rowIndex+columnIndex}>{value}</td>
                })
            }
        </tr>
    });

    return(
        <table className="gameTableContainer">
            <tbody>
                {tableContent}
            </tbody>
        </table>
    );
}

export default createTable;