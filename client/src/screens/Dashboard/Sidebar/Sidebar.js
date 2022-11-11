import React from 'react';
import './Sidebar.scss';
import {connect} from "react-redux";
import {toggleSidebar} from "../../../store/action/ui.action";
import {NavLink} from "react-router-dom";

const Sidebar = props => {
    return (
        <div className={'Sidebar'}>
            <div className="Sidebar__item Sidebar__menu">
                <div onClick={e => {
                    props.toggleSidebar();
                }} className="Sidebar__burger">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <NavLink to={'/dashboard/home'} className={({isActive}) => {
                const listClass = ['Sidebar__item'];
                if(isActive) listClass.push('Sidebar__active');
                return listClass.join(' ');
            }}>
                <div  className="Sidebar__home">
                    <i className="fa-solid fa-house"></i>
                </div>
            </NavLink>
            <NavLink end={true} to={'/dashboard/workspaces'} className={({isActive}) => {
                const listClass = ['Sidebar__item'];
                if(isActive) listClass.push('Sidebar__active');
                return listClass.join(' ');
            }}>
                <div  className="Sidebar__workspaces">
                    <i className="fa-solid fa-shop"></i>
                </div>
            </NavLink>

            <NavLink to={'/dashboard/settings'} className={({isActive}) => {
                const listClass = ['Sidebar__item'];
                if(isActive) listClass.push('Sidebar__active');
                return listClass.join(' ');
            }}>
                <div  className="Sidebar__settings">
                    <i className="fa-solid fa-gear"></i>
                </div>
            </NavLink>
        </div>
    );
};

export default connect(null, {toggleSidebar}) (Sidebar);
