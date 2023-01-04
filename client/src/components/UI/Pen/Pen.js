import React from 'react';
import './Pen.scss';

const Pen = props => {
    return (
        <span onMouseEnter={e => {e.preventDefault(); e.stopPropagation()}} className={'Pen'}>
            <i className="fa-solid fa-pen "></i>
            <span className={'arrow'}></span>
        </span>
    );
};

export default Pen;