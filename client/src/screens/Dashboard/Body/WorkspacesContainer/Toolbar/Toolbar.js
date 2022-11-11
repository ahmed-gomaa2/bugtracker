import React from 'react';
import './Toolbar.scss';
import {connect} from "react-redux";
import {toggleWorkspaceCreateForm} from "../../../../../store/action/ui.action";

const Toolbar = props => {
    return (
        <div className={'Toolbar'}>
            <div className="Toolbar__header">
                <h3>Workspaces</h3>
            </div>
            <p onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                props.toggleWorkspaceCreateForm();
            }} className="Toolbar__add">
                <i className="fa-solid fa-plus"></i>
                <span>Add New</span>
            </p>
        </div>
    );
};

export default connect(null, {toggleWorkspaceCreateForm}) (Toolbar);
