import React from 'react';
import './SelectBox.scss';

const selectBox = props => {
    let selectDivDOM = [];
    let selectUlDOM = [];

    props.levels.forEach( (elObj, key) => {
        selectDivDOM.push(<div className="select-box__value" key={elObj.level}>
            <input onChange={() => props.change(elObj.value)} className="select-box__input" type="radio" id={elObj.level} value={elObj.value} name="Ben" checked={props.defaultLevel === elObj.value ? true : false}/>
            <p className="select-box__input-text">{elObj.level}</p>
        </div>);

        selectUlDOM.push(<li key={elObj.level}>
             <label className="select-box__option" htmlFor={elObj.level} aria-hidden="true">{elObj.level}</label>
        </li>);
    });

    return (
        <div className="select-box">
        <div className="select-box__current" tabIndex="1">
            {selectDivDOM}
            <img className="select-box__icon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg" alt="Arrow Icon" aria-hidden="true"/>
        </div>
        <ul className="select-box__list">
            {selectUlDOM}
        </ul>
        </div>
    );
};

export default selectBox;