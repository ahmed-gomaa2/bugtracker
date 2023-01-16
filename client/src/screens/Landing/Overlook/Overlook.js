import React from 'react';
import featuresImg from '../images/features.PNG';
import './Overlook.scss';

const Overlook = props => {
    return (
        <div className={'Overlook'}>
            <img src={featuresImg} alt="overlook"/>
        </div>
    );
};

export default Overlook;