import React, { Component } from 'react';
import GameController from './GameController';
import SelectBox from '../../components/SelectBox';

const GAMELEVELS = [
    { level: 'Easy',  value: 8},
    { level: 'Medium',  value: 10},
    { level: 'Hard',  value: 12},
];

class Index extends Component {
    state = {
        gameStart : false,
        gameLevel : GAMELEVELS[0].value,
        showTime: {
            seconds: '00',
            minutes: '00'
        },
    }

    handleOnChange = levelValue => {
        this.setState({
            gameLevel: +levelValue,
        }, () => {
            if (this.state.gameStart) {
                clearInterval(this.setIntervalValue);
                this.resetTimer();
                this.setIntervalValue = setInterval(this.updateTimer , 1000);
            }
        });
    }

    handleUserInput = () => {
        this.setState((prevState, prevProps) => {
            return {
                gameStart: !prevState.gameStart
            };
        }, () => {
            if (this.state.gameStart) {
                this.setIntervalValue = setInterval(this.updateTimer , 1000);
            } else {
                clearInterval(this.setIntervalValue);
                this.resetTimer();
            }
        });
    }

    resetTimer = () => {
        this.setState({
            showTime: {
                seconds: '00',
                minutes: '00'
            }
        });
    }

    updateTimer = () => {
        let copyState = {...this.state};
        let seconds = +(copyState.showTime.seconds) + 1;
        let minutes = +(copyState.showTime.minutes);

        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }

        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        this.setState({
            showTime: {
                seconds: seconds,
                minutes: minutes
            }
        });
    }

    render() {
        return(
            <div className="user-input-panel">
                <SelectBox 
                    levels={GAMELEVELS} 
                    change={this.handleOnChange}
                    defaultLevel={this.state.gameLevel} />
                <div className="gameInfo">
                    <span className="bombCount">{this.state.gameLevel}</span>
                    <button onClick={this.handleUserInput}>{this.state.gameStart ? "Reset" : "Start" }</button>
                    <span>{this.state.showTime.minutes}:{this.state.showTime.seconds}</span>
                </div>
                {this.state.gameStart ? 
                    <GameController 
                        level={this.state.gameLevel}
                        handelUserInput={this.handleUserInput}/> :
                    null
                }
            </div>
        );
    }
}

export default Index;