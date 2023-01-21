import React, {useState} from 'react';
import './Title.scss';

const Title = props => {
    const [editing, setEditing] = useState(false);
    return (
        <td className={'Title'}>
            <div>
                <>
                    {props.title}
                </>
            </div>
        </td>
    );
};

export default Title;