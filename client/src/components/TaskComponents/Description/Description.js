import React, {useState} from 'react';
import './Description.scss';

const Description = props => {
    const [editing, setEditing] = useState(false);

    const descClickHandler = e => {
        console.log(e);
        if(e.detail === 2) {
            setEditing(true);
        }
    }
    return (
        <td onClick={descClickHandler} className={'Description'}>
            {
                editing ? (
                    <form className={'Description__form'}>
                        <input onBlur={e => setEditing(false)} value={props.description} type="text"/>
                    </form>
                ) : (
                    <p>{props.description.split(' ').splice(0, 5).join(' ')}</p>
                )
            }
        </td>
    );
};

export default Description;