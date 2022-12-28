import React, {useState} from 'react';
import './Status.scss';

const status = {
    1: 'not started',
    2: 'in progress',
    3: 'done',
    4: 'to be tested',
}

const Status = props => {
    const [editing, SetEditing] = useState(false);
    return (
        <td className={'Status'}>
            {
                editing ? (
                    <form>
                        <input type={'text'}/>
                        <button>Edit</button>
                    </form>
                ) : (
                    <p className={`status-${props.status}`}>{status[props.status]}</p>
                )
            }
        </td>
    );
};

export default Status;