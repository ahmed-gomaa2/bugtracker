import React, {useEffect, useRef, useState} from 'react';
import './Type.scss';
import {connect} from "react-redux";
import {changeType} from "../../../store/action/workspace.action";
import Pen from '../../UI/Pen/Pen'
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();

    const selectFocusHandler = e => {
        e.target.style.childNodes[1].clientHeight = '100px';
    }

    const typeClickHandler = t => {
        if(props.type != t) {
            props.changeType(props.task, +t, props.task.workspace_id, navigate, props.socket);
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
        <td className={'Type'}>
            {
                editing ? (
                    <div className="Type__select">
                        <p onClick={e => props.task.owner && setEditing(true)} className={`type type-${props.type}`}>{types[props.type].icon}<span>{types[props.type].name}</span></p>
                        <div ref={dropdownRef} className="Type__options">
                            {
                                Object.keys(types).map((t, i) => (
                                    <p key={i} onClick={e => typeClickHandler(t)} className={`option type type-${t}`}>{types[t].icon}<span>{types[t].name}</span></p>
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <p onMouseLeave={e => setHovered(false)} onMouseEnter={e => props.task.owner && setHovered(true)} onClick={e => {
                        if(props.task.owner) {
                            setEditing(true);
                            setHovered(false);
                        }
                    }} className={`type type-${props.type}`}>{types[props.type].icon}<span>{types[props.type].name}</span>{hovered && <Pen />}</p>
                )
            }
            <div onClick={e => setEditing(false)} className="Type__backdrop" style={{display: `${editing ? 'block' : 'none'}`}}></div>
        </td>
    );
};

const mapStateToProps = (state) => {
    return {
        socket: state.auth.socket
    }
}

export default connect(mapStateToProps, {changeType}) (Type);