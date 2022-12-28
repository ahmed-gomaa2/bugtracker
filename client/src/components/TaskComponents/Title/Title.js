import React, {useState} from 'react';
import './Title.scss';

const Title = props => {
    const [editing, setEditing] = useState(false);
    return (
        <td className={'Title'}>
            {
                editing ? (
                    <form action="submit">
                        <input type="text"/>
                        <button>Edit</button>
                    </form>
                ) : (
                    <div>
                        <p>
                            {props.title}
                        </p>
                    </div>
                )
            }
        </td>
    );
};

export default Title;