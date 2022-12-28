import React from 'react';
import './Toolbar.scss';

const Toolbar = props => {
    return (
        <div className={'Toolbar'}>
            {props.children}
        </div>
    );
};

export default Toolbar;