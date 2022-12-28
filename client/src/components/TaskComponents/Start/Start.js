import React, {useState} from 'react';

import dateFormat from '../../../utls/date.format';

const Start = props => {
    const [editing, setEditing] = useState(false);

    return (
        <td>
            {
                editing ? (
                    <form>
                        <input />
                        <button>Edit</button>
                    </form>
                ) : (
                    <p>{dateFormat(props.start_date)}</p>
                )
            }
        </td>
    );
};

export default Start;