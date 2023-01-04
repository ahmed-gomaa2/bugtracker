import React, {useState} from 'react';
import './Status.scss';
import {connect} from "react-redux";
import Pen from "../../UI/Pen/Pen";
import {changeStatus} from "../../../store/action/workspace.action";

const status = {
    1: {
        name: 'not started',
        icon: <i className="fa-solid fa-face-sad-tear"></i>
    },
    2: {
        name: 'in progress',
        icon: <i className="fa-solid fa-laptop-code"></i>
    },
    3: {
        name: 'to be tested',
        icon: <i className="fa-solid fa-circle-pause"></i>
    },
    4: {
        name: 'done',
        icon: <i className="fa-solid fa-face-smile"></i>
    },
}



const Status = props => {
    const [editing, setEditing] = useState(false);
    const [hovered, setHovered] = useState(false);

    const statusClickHandler = async s => {
        if(props.type != s) {
            props.changeStatus(props.task.id, +s, props.task.workspace_id);
        }
        setEditing(false);
        setHovered(false);
    }

    const statusSelectRender = () => {
        // return Object.keys(status).map((s, i) => (
        //             <p onClick={e => statusClickHandler(s)} className={`status status-${s}`}>{status[s].icon}<span>{status[s].name}</span>
        //             </p>
        //        ))
        return Object.keys(status).map((s, i) => {
            return s != 4 ? (
                <p key={i} onClick={e => statusClickHandler(s)} className={`option status status-${s}`}>{status[s].icon}<span>{status[s].name}</span></p>
            ) : (
                props.user.id == props.workspaceData.owner_id && <p key={i} onClick={e => statusClickHandler(s)} className={`option status status-${s}`}>{status[s].icon}<span>{status[s].name}</span></p>
            )
        })
    }
    return (
        <td className={'Status'}>
            {
                editing ? (
                    <div className="Status__select">
                        <p className={`status status-${props.status}`}>{status[props.status].icon}<span>{status[props.status].name}</span></p>
                        <div className="Status__options">
                            {
                                statusSelectRender()
                            }
                        </div>
                        <div onClick={e => setEditing(false)} className="Status__backdrop"></div>
                    </div>
                ) : (
                    <p onMouseLeave={e => setHovered(false)} onMouseEnter={e => setHovered(true)} onClick={e => {
                        setEditing(true);
                        setHovered(false);
                    }} className={`status status-${props.status}`}>{status[props.status].icon}<span>{status[props.status].name}</span>{hovered && <Pen />}</p>
                )
            }
        </td>
    );
};

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        workspaceData: state.workspaces.currentWorkspaceData
    }
}

export default connect(mapStateToProps, {changeStatus}) (Status);