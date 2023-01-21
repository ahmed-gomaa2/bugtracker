import React, {useEffect, useRef} from 'react';
import Dropdown from "../../../../../components/UI/Dropdown/Dropdown";
import './WorkspaceToolbar.scss';

const WorkspaceToolbar = props => {
    return (
        <div className={'WorkspaceToolbar'}>
            <div className="WorkspaceToolbar__header">
                <p>{props.ws?.name}</p>
            </div>
            <div className="WorkspaceToolbar__menu">
                <div onClick={props.openAdding} className="WorkspaceToolbar__addTask">
                    <div className="WorkspaceToolbar__addTask-hover">add task</div>
                    <i className="fa-solid fa-plus"></i>
                </div>
                <Dropdown ws={props.ws} />
            </div>
        </div>
    );
};

export default WorkspaceToolbar;