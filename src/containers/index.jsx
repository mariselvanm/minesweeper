import React, { Component } from 'react';
import MindsweeperIndex from './Mindsweeper';
import './index.scss';

class Index extends Component {
    render() {
        return (
            <div className="game-logic-contanier">
                <MindsweeperIndex />
            </div>
        );
    }
}

export default Index;