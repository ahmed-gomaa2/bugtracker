import React from 'react';
import './Priority.scss';

const priorities = {
    1: 'high',
    2: 'medium',
    3: 'low'
}

const Priority = props => {
    return (
        <td className={'Priority'}>
            <p className={`priority-${props.priority}`}>{priorities[props.priority]}</p>
        </td>
    );
};

export default Priority;