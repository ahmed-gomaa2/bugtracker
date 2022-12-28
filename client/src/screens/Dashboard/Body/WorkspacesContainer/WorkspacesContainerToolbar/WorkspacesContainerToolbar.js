import React from 'react';
import './WorkspacesContainerToolbar.scss';
import {connect} from "react-redux";
import {toggleWorkspaceCreateForm} from "../../../../../store/action/ui.action";

const WorkspacesContainerToolbar = props => {
    return (
        <div className={'WorkspacesContainerToolbar'}>
            <div className="WorkspacesContainerToolbar__header">
                <h3>Workspaces</h3>
            </div>
            <p onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                props.toggleWorkspaceCreateForm();
            }} className="WorkspacesContainerToolbar__add">
                <i className="fa-solid fa-plus"></i>
                <span>Add New</span>
            </p>
        </div>
    );
};

export default connect(null, {toggleWorkspaceCreateForm}) (WorkspacesContainerToolbar);
