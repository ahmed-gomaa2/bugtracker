import React from 'react';
import dateFormat from '../../../utls/date.format';

const End = props => {
    return (
        <td className={'End'}>
            <p>{dateFormat(props.end_date)}</p>
        </td>
    );
};

export default End;