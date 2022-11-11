import React from 'react';
import './Dashboard.scss';
import Sidebar from "./Sidebar/Sidebar";
import Body from "./Body/Body";
import {connect} from "react-redux";
import SidebarFull from "./SidebarFull/SidebarFull";
import CreateWorkspaceForm from "../../components/CreateWorkspaceForm/CreateWorkspaceForm";
import EditWorkspaceForm from "../../components/EditWorkspaceForm/EditWorkspaceForm";

const Dashboard = (props) => {
    return (
        <div className={'Dashboard'}>
            {
                props.toggleSidebar ? (
                    <SidebarFull />
                ) : (
                    <Sidebar />
                )
            }
            <Body />
            <CreateWorkspaceForm />
            <EditWorkspaceForm />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        toggleSidebar: state.ui.toggleSidebar
    }
}

export default connect(mapStateToProps,null) (Dashboard);
