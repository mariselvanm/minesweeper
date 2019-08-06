import React from 'react';
import './Model.scss';

const model = props => {
    return (
        <div className={"Model ".concat(props.show ? "showModel":"hideModel")}>
            <div>{props.children}</div>
            <button onClick={props.click}>Close</button>
        </div>
    )
}

export default model;