import React from 'react';
import Dropdown from "../../../../../components/UI/Dropdown/Dropdown";
import './WorkspaceToolbar.scss';

const WorkspaceToolbar = props => {
    return (
        <div className={'WorkspaceToolbar'}>
            <div className="WorkspaceToolbar__header">
                <p>{props.ws?.name}</p>
            </div>
            <Dropdown ws={props.ws} />
        </div>
    );
};

export default WorkspaceToolbar;