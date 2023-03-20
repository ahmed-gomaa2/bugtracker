import React, {useEffect, useState} from 'react';
import './Dashboard.scss';
import Sidebar from "./Sidebar/Sidebar";
import Body from "./Body/Body";
import {connect} from "react-redux";
import SidebarFull from "./SidebarFull/SidebarFull";
import CreateWorkspaceForm from "../../components/CreateWorkspaceForm/CreateWorkspaceForm";
import EditWorkspaceForm from "../../components/EditWorkspaceForm/EditWorkspaceForm";
import Task from "./Body/Workspace/Task/Task";

const Dashboard = (props) => {

    return (
        <div className={'Dashboard'}>
            {
                props.toggleSidebar ? (
                    <>
                        <SidebarFull />

                    </>
                ) : (
                    <Sidebar />
                )
            }
            <Body />
            {
                props.toggleTask && <Task />
            }
            <CreateWorkspaceForm />
            <EditWorkspaceForm />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        toggleSidebar: state.ui.toggleSidebar,
        toggleTask: state.ui.toggleTaskOpen,
        socket: state.auth.socket
    }
}

export default connect(mapStateToProps,null) (Dashboard);
