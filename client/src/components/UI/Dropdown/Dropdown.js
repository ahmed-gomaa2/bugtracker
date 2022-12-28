import React, {useEffect, useRef, useState} from 'react';
import './Dropdown.scss';
import {connect} from "react-redux";
import {toggleWorkspaceEditForm} from "../../../store/action/ui.action";
import {deleteWorkspace} from "../../../store/action/workspace.action";

const Dropdown = (props) => {
    const [dropdown, setDropdown] = useState(false);
    const dropdownRef = useRef();
    useEffect(() => {
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

    );
};

export default connect(null, {toggleWorkspaceEditForm}) (Dropdown);