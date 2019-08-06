import React, { Component } from 'react';
import CreateTable from '../../../components/CreateTable';
import './index.scss';
import Model from '../../../components/Model';

const GAMESTATE = {
    start: 0,
    loose: 1,
    win: 2
}

class GameController extends Component {
    state = {
        bombLocations: null,
        gridCellValues: null,
        showGameEndResult: false,
        gameState: GAMESTATE.start,
        flagedElements: [],
        isModelShow:false,
    }

    componentDidMount() {
        this.createBombLocations();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.level !== this.props.level) {
            this.resetState();
        }
    }

    resetState = () => {
        this.setState({
            bombLocations: null,
            gridCellValues: null,
            showGameEndResult: false,
            gameState: GAMESTATE.start,
            isModelShow: false
        }, this.props.handelUserInput);
    }

    createBombLocations = () => {
        let bombLocations = [];
        let levelValue = this.props.level;

        while(bombLocations.length !== this.props.level) {
            let firstDigit = Math.floor(Math.random() * levelValue) + 0;
            let secondDigit = Math.floor(Math.random() * levelValue) + 0;
            let randomTwoDigitNumber = '' + firstDigit + secondDigit;
            
            // Check index already present
            if (!bombLocations.includes(randomTwoDigitNumber)) {
                bombLocations.push(randomTwoDigitNumber);
            }
        }
        
        // Use callback function as a second argument
        this.setState({
            bombLocations: bombLocations
        }, this.createInitialArray);

        console.log(bombLocations);
    }

    createInitialArray = () => {
        let bombLocations = [...this.state.bombLocations];
        let levelValue = this.props.level;
        let cellObject = {
            isBomb: false,
            isEmpty: true,
            row: 0,
            column: 0,
            isShow: false,
            isFlaged: false,
        };

        let gridArray = Array(levelValue).fill('').map(_ => {
            return Array(levelValue).fill('as');
        });
        
        //Push Object into Array Cells
        gridArray.forEach( (row, rowIndex) => {
            row.forEach( (column, columnIndex) => {
                let bombCountForCell = 0;
                let cellObjectDeepCopy = {...cellObject};
                let concatRowColum = '' + rowIndex + columnIndex;
                let isBomb = bombLocations.includes(concatRowColum) ? true : false;

                cellObjectDeepCopy.row = rowIndex;
                cellObjectDeepCopy.column = columnIndex;
                cellObjectDeepCopy.isBomb = isBomb;

                if (!isBomb) {
                    // Check top left
                    if ( rowIndex-1 >=0 && columnIndex-1 >= 0) {
                        let index = '' + (rowIndex-1) + (columnIndex-1);
                        
                        if (bombLocations.includes(index)) {
                            bombCountForCell++;
                        }
                    }

                    // Check top center
                    if (rowIndex-1 >= 0) {
                        let index = '' + (rowIndex-1) + columnIndex;
                        
                        if (bombLocations.includes(index)) {
                            bombCountForCell++;
                        }
                    }

                    // Check top right
                    if (rowIndex-1 >= 0 && columnIndex+1 < this.props.level) {
                        let index = '' + (rowIndex-1) + (columnIndex+1);
                        
                        if (bombLocations.includes(index)) {
                            bombCountForCell++;
                        }
                    }

                    // Check left
                    if (columnIndex-1 >= 0) {
                        let index = '' + rowIndex + (columnIndex-1);
                        
                        if (bombLocations.includes(index)) {
                            bombCountForCell++;
                        }
                    }

                    // Check right
                    if (columnIndex+1 < this.props.level) {
                        let index = '' + rowIndex + (columnIndex+1);
                        
                        if (bombLocations.includes(index)) {
                            bombCountForCell++;
                        }
                    }

                    // Check bottom left
                    if (rowIndex+1 < this.props.level && columnIndex-1 >= 0) {
                        let index = '' + (rowIndex+1) + (columnIndex-1);
                        
                        if (bombLocations.includes(index)) {
                            bombCountForCell++;
                        }
                    }

                    // Check bottom center
                    if (rowIndex+1 < this.props.level) {
                        let index = '' + (rowIndex+1) + columnIndex;
                        
                        if (bombLocations.includes(index)) {
                            bombCountForCell++;
                        }
                    }

                    // Check bottom right
                    if (rowIndex+1 < this.props.level && columnIndex+1 < this.props.level) {
                        let index = '' + (rowIndex+1) + (columnIndex+1);
                        
                        if (bombLocations.includes(index)) {
                            bombCountForCell++;
                        }
                    }

                    cellObjectDeepCopy.bombCount = bombCountForCell;

                    if (bombCountForCell) {
                        cellObjectDeepCopy.isEmpty = false;
                    }
                }

                gridArray[rowIndex][columnIndex] = cellObjectDeepCopy;
            });
        });

        this.setState({
            gridCellValues: gridArray
        })
    }

    handelCellRightClick = (cellObj, event) => {
        let stateObjDeepCopy = {...this.state};
        let gridCellValuesCopy = stateObjDeepCopy.gridCellValues;
        let flagedElementsCopy = stateObjDeepCopy.flagedElements;
        let flagBoolean = gridCellValuesCopy[cellObj.row][cellObj.column].isFlaged;
        gridCellValuesCopy[cellObj.row][cellObj.column].isFlaged = !flagBoolean;
        gridCellValuesCopy[cellObj.row][cellObj.column].isShow = !flagBoolean;
        
        if (!flagBoolean) {
            flagedElementsCopy.push(''+ cellObj.row + cellObj.column);
        } else {
            let indexOfFlagedElement = flagedElementsCopy.indexOf(''+ cellObj.row + cellObj.column);
            flagedElementsCopy.splice(indexOfFlagedElement, 1);
        }
        
        this.setState({
            gridCellValues: gridCellValuesCopy,
            flagedElements: flagedElementsCopy
        }, this.findWinOrLoose);
        
        event.preventDefault();
    }

    findWinOrLoose = () => {
        let stateObjDeepCopy = {...this.state};
        let gridCellValuesCopy = stateObjDeepCopy.gridCellValues;
        let flagedElementsCopy = stateObjDeepCopy.flagedElements;
        let bombLocationsCopy = stateObjDeepCopy.bombLocations;

        // Check all bombs are flaged
        if ( flagedElementsCopy.length >= bombLocationsCopy.length ) {
            bombLocationsCopy.forEach(location => {
                if(flagedElementsCopy.includes(location)) {
                    let indexOfLocationElement = flagedElementsCopy.indexOf(location);
                    flagedElementsCopy.splice(indexOfLocationElement, 1);
                }
            });
        }

        if (flagedElementsCopy.length === 0) {
            let allElementShown = true;
            // Check all spots are in shown state
            gridCellValuesCopy.forEach(row => {
                row.forEach(cell => {
                    if (!cell.isShow) {
                        allElementShown = false;
                    }
                });
            });

            if (allElementShown) {
                this.setState({
                    showGameEndResult: true,
                    gameState: GAMESTATE.win,
                    isModelShow: true
                });

                return;
            }
        }
    }

    handleCellClick = cellObj => {
        debugger;
        if (cellObj.isShow) {

            return;
        }

        if (cellObj.isBomb) {     
            this.setState({
                showGameEndResult: true,
                gameState: GAMESTATE.loose,
                isModelShow: true
            });
            
            return;
        }
        
        let stateDeepCopy = {...this.state};
        let gridCellValuesCopy = stateDeepCopy.gridCellValues;

        if (cellObj.bombCount) {
            cellObj.isShow = true;
            gridCellValuesCopy[cellObj.row][cellObj.column] = cellObj;
            this.setState({
                gridCellValues: gridCellValuesCopy
            }, this.findWinOrLoose);
        } else {
            let emptyBoxArray = [ cellObj.row +'_'+ cellObj.column];
           
            while(emptyBoxArray.length) {
                let returnValues = this.revelAroundEmptyNodes(emptyBoxArray, gridCellValuesCopy);
                emptyBoxArray = [...returnValues.emptyArrayCatcher];
            }

            this.setState({
                gridCellValues: gridCellValuesCopy
            }, this.findWinOrLoose);
        }
    }

    revelAroundEmptyNodes(emptyBoxArray, gridCellValuesCopy) {
        let emptyArrayCatcher = [];

        let checkBoxStatus = (rowIndex, columnIndex) => {
            let cell = gridCellValuesCopy[rowIndex][columnIndex];

            if (!cell.isBomb && !cell.isShow && cell.isEmpty) {
                emptyArrayCatcher.push( (rowIndex) +'_'+ (columnIndex));
            } else {
                cell.isShow = true;
            }
        };

        emptyBoxArray.forEach(el => {
            let rowIndex = +el.split('_')[0];
            let columnIndex = +el.split('_')[1];
            
            gridCellValuesCopy[rowIndex][columnIndex].isShow = true;

            // Check top left
            if ( rowIndex-1 >=0 && columnIndex-1 >= 0) {
                checkBoxStatus(rowIndex-1, columnIndex-1);
            }

            // Check top center
            if (rowIndex-1 >= 0) {
                checkBoxStatus(rowIndex-1, columnIndex);
            }

            // Check top right
            if (rowIndex-1 >= 0 && columnIndex+1 < this.props.level) {
                checkBoxStatus(rowIndex-1, columnIndex+1);
            }

            // Check left
            if (columnIndex-1 >= 0) {
                checkBoxStatus(rowIndex, columnIndex-1);
            }

            // Check right
            if (columnIndex+1 < this.props.level) {
                checkBoxStatus(rowIndex, columnIndex+1);
            }

            // Check bottom left
            if (rowIndex+1 < this.props.level && columnIndex-1 >= 0) {
                checkBoxStatus(rowIndex+1, columnIndex-1);
            }

            // Check bottom center
            if (rowIndex+1 < this.props.level) {
                checkBoxStatus(rowIndex+1, columnIndex);
            }

            // Check bottom right
            if (rowIndex+1 < this.props.level && columnIndex+1 < this.props.level) {
                checkBoxStatus(rowIndex+1, columnIndex+1);
            }
        });

        return { emptyArrayCatcher, gridCellValuesCopy};
    }

    render() {
        let winOrloose = this.state.gameState === GAMESTATE.loose ?
                         <Model 
                            show={this.state.isModelShow}
                            click={this.resetState}> You Loose </Model> : 
                         this.state.gameState === GAMESTATE.win ?
                         <Model 
                            show={this.state.isModelShow} 
                            click={this.resetState} > You Win </Model> : null;

        return (
            <div className="gameController">
                {this.state.gridCellValues ? 
                    <CreateTable 
                        clickListener={this.handleCellClick}
                        showAllResult={this.state.showGameEndResult}
                        tablecontent={this.state.gridCellValues} 
                        rightclickListener={this.handelCellRightClick}/> :
                    null
                }
                {winOrloose}              
            </div>
        )
    }
}

export default GameController;