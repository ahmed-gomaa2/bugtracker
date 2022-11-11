import React, {useEffect, useRef, useState} from 'react';
import './WorkspacesListItem.scss';
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {deleteWorkspace} from "../../../../../store/action/workspace.action";
import {toggleWorkspaceEditForm} from "../../../../../store/action/ui.action";

const WorkspacesListItem = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef();
    useEffect(() => {
        console.log(props);
        if(dropdownRef.current){
            const elRect = dropdownRef.current.getBoundingClientRect();
            const fromBottom = window.innerHeight - elRect.bottom;
            if(fromBottom < 0) {
                dropdownRef.current.style.transform = `translateY(-${Math.abs(fromBottom)}px)`
            }else {
                dropdownRef.current.style.transform = 'none';
            }
        }
    }, [dropdown]);
    return (
        <NavLink to={`/dashboard/workspaces/${props.ws.id}`} className={'WorkspacesItem'}>
            <div className="WorkspacesItem__header">
                <h5>{props.ws.name}</h5>
            </div>
            {
                props.error && props.error.type === 'client' && (<p>{props.error.msg}</p>)
            }
            <div className="WorkspacesItem__dropdown">
                <div onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdown(!dropdown);
                }} className="WorkspacesItem__dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropdown(!dropdown);
                }} className={`WorkspacesItem__dropdown--menu-backdrop ${dropdown && 'WorkspacesItem__dropdown--menu-show'}`}></div>
                <div onClick={e => {
                    e.preventDefault();
                }} ref={dropdownRef} className={`WorkspacesItem__dropdown--menu ${dropdown && 'WorkspacesItem__dropdown--menu-show'}`}>
                    <div onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        props.deleteWorkspace(props.ws.id);
                        setDropdown(!dropdown)
                    }} className="WorkspacesItem__dropdown--menu-el WorkspacesItem__dropdown--menu-delete">
                        <i className="fa-solid fa-trash"></i>
                        <p>Delete</p>
                    </div>
                    <div onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        props.toggleWorkspaceEditForm(props.ws.id);
                        setDropdown(false);
                    }} className="WorkspacesItem__dropdown--menu-el WorkspacesItem__dropdown--menu-edit">
                        <i className="fa-solid fa-pen"></i>
                        <p>Edit</p>
                    </div>
                </div>
            </div>
        </NavLink>
    );
};

const mapStateToProps = state => {
    return {
        error: state.workspaces.error
    }
}

export default connect(null, {deleteWorkspace, toggleWorkspaceEditForm}) (WorkspacesListItem);
