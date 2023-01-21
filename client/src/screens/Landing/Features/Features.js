import React, {useState} from 'react';
import './Features.scss';

const features = [
    1
];

const Features = props => {
    const [current, setCurrent] = useState(0);

    return (
        <div className={'Features'}>
            <div className="Features__container">
                <div className="Features__item"></div>
                <div className="Features__item"></div>
                <div className="Features__item"></div>
            </div>
        </div>
    )
};
export default Features;