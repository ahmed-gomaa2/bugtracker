import React, {useEffect, useState} from 'react';
import './Type.scss';
import {connect} from "react-redux";
import {changeType} from "../../../store/action/workspace.action";
import Pen from '../../UI/Pen/Pen'

const types= {
    1: {
        name: 'bug',
        icon: <i className="fa-solid fa-bug"></i>
    },

    2: {
        name: 'feature',
        icon: <i className="fa-solid fa-microchip"></i>
    },
    3: {
        name: 'task',
        icon: <i className="fa-solid fa-list-check"></i>
    }
}

const Type = props => {
    const [editing, setEditing] = useState(false);
    const [hovered, setHovered] = useState(false);

    const selectFocusHandler = e => {
        console.log(e);
        e.target.style.childNodes[1].clientHeight = '100px';
    }

    const typeClickHandler = t => {
        if(props.type != t) {
            props.changeType(props.task.id, +t, props.task.workspace_id);
        }
        setEditing(false);
    }
    return (
        <td className={'Type'}>
            {
                editing ? (
                    <div className="Type__select">
                        <p onClick={e => setEditing(true)} className={`type type-${props.type}`}>{types[props.type].icon}<span>{types[props.type].name}</span></p>
                        <div className="Type__options">
                            {
                                Object.keys(types).map((t, i) => (
                                    <p key={i} onClick={e => typeClickHandler(t)} className={`option type type-${t}`}>{types[t].icon}<span>{types[t].name}</span></p>
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <p onMouseLeave={e => setHovered(false)} onMouseEnter={e => setHovered(true)} onClick={e => {
                        setEditing(true);
                        setHovered(false);
                    }} className={`type type-${props.type}`}>{types[props.type].icon}<span>{types[props.type].name}</span>{hovered && <Pen />}</p>
                )
            }
            <div onClick={e => setEditing(false)} className="Type__backdrop" style={{display: `${editing ? 'block' : 'none'}`}}></div>
        </td>
    );
};

export default connect(null, {changeType}) (Type);