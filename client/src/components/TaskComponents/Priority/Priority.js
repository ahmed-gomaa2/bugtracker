import React, {useEffect, useRef, useState} from 'react';
import './Priority.scss';
import {changePriority} from "../../../store/action/workspace.action";
import {connect} from "react-redux";

const priorities = {
    1: 'high',
    2: 'medium',
    3: 'low'
}

const Priority = props => {
    const [editing, setEditing] = useState(false);
    const priorityClickHandler = k => {
        if(k != props.task.priority) {
            props.changePriority(props.task.id, k, props.task.workspace_id);
        }
        setEditing(false);
    }

    const dropdownRef = useRef();

    useEffect(() => {
        if(dropdownRef.current){
            const elRect = dropdownRef.current.getBoundingClientRect();
            const fromBottom = window.innerHeight - elRect.bottom;
            const fromRight = window.innerWidth - elRect.right;
            if(fromRight < 0 && fromBottom < 0) {
                dropdownRef.current.style.transform = `translate(-${Math.abs(fromRight)}px, -${Math.abs(fromBottom)}px)`
            } else if(fromRight < 0) {
                dropdownRef.current.style.transform = `translateX(-${Math.abs(fromRight)}px)`
            }else if(fromBottom < 0) {
                dropdownRef.current.style.transform = `translateY(-${Math.abs(fromBottom)}px)`
            } else {
                dropdownRef.current.style.transform = 'none';
            }

        }
    }, [editing]);

    return (
        <td className={'Priority'}>
            {
                editing ? (
                    <div className="Priority__select">
                        <p className={`priority priority-${props.priority}`}>{priorities[props.priority]}</p>
                        <div ref={dropdownRef} className="Priority__options">
                            {
                                Object.keys(priorities).map((k, i) => (
                                    <p onClick={e => priorityClickHandler(k)} key={i} className={`option priority-${k}`}>{priorities[k]}</p>
                                ))
                            }
                        </div>
                        <div onClick={e => setEditing(false)} className="Priority__backdrop"></div>
                    </div>
                ) : (
                    <p id={'priority'}  onClick={e => {
                        setEditing(true);
                    }} className={`priority priority-${props.priority}`}>{priorities[props.priority]}</p>
                )
            }
        </td>
    );
};

export default connect(null, {changePriority}) (Priority);