import React, {useState} from 'react';
import './Type.scss';

const types= {
    1: 'bug',
    2: 'feature',
    3: 'task'
}

const Type = props => {
    const [editing, setEditing] = useState(false);
    return (
        <td className={'Type'}>
            {
                editing ? (
                    <form className={'Type__form'}>
                        <select name="type" id="type" className="Type__select">
                            <option value="1">bug</option>
                            <option value="2">feature</option>
                            <option value="3">task</option>
                        </select>
                    </form>
                ) : (
                    <p onClick={e => setEditing(true)} className={`type-${props.type}`}>{types[props.type]}</p>
                )
            }
            <div onClick={e => setEditing(false)} className="Type__backdrop" style={{display: `${editing ? 'block' : 'none'}`}}></div>
        </td>
    );
};

export default Type;