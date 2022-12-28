import React, {useEffect, useRef, useState} from 'react';
import './WorkspacesListItem.scss';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {deleteWorkspace} from "../../../../../store/action/workspace.action";
import {toggleWorkspaceEditForm} from "../../../../../store/action/ui.action";
import Dropdown from "../../../../../components/UI/Dropdown/Dropdown";

const WorkspacesListItem = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef();

    return (
        <NavLink to={`/dashboard/workspaces/${props.ws.id}`} className={'WorkspacesItem'}>
            <div className="WorkspacesItem__header">
                <h5>{props.ws.name}</h5>
            </div>
            {
                props.error && props.error.type === 'client' && (<p>{props.error.msg}</p>)
            }
            <Dropdown ws={props.ws} />
        </NavLink>
    );
};

const mapStateToProps = state => {
    return {
        error: state.workspaces.error
    }
}

export default connect(null, {deleteWorkspace, toggleWorkspaceEditForm}) (WorkspacesListItem);
