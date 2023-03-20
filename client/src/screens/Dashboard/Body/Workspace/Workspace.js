import React, {useEffect, useState} from 'react';
import './Workspace.scss';
import WorkspaceToolbar from "./WorkspaceToolbar/WorkspaceToolbar";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {fetchWorkspaceData} from "../../../../store/action/workspace.action";
import Toolbar from "../../../../components/HOC/Toolbar/Toolbar";
import WorkspaceBody from "./WorkspaceBody/WorkspaceBody";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import CreateTask from "../../../../components/CreateTask/CreateTask";
import Task from "./Task/Task";

const Workspace = props => {
    const [adding, setAdding] = useState(false);

    const {workspace_id} = useParams();

    useEffect(() => {
        console.log(workspace_id, props.tasks);
        if(workspace_id) {
            props.fetchWorkspaceData(workspace_id);
        }
    }, [workspace_id]);

    const closeAddingForm = e => {
        setAdding(false);
    }

    const openAddingForm = e => {
        setAdding(true);
    }

    return (
        <div className={'Workspace'}>
            {props.fetchingWorkspace ? (
                <Spinner />
            ) : (
                <>
                    <Toolbar>
                        <WorkspaceToolbar openAdding={openAddingForm} ws={props.workspaceInfo}/>
                    </Toolbar>
                    <WorkspaceBody />
                    {
                        adding && (
                            <CreateTask currentUser={props.currentUser} users={props.users} closeAdding={closeAddingForm} workspace={props.workspaceInfo} />
                        )
                    }
                </>
            )}
        </div>
    );
};

const mapStateToProps = state => {
    return {
        workspaceInfo: state.workspaces.currentWorkspaceData,
        tasks: state.workspaces.filteredWorkspaceTasks,
        filters: state.workspaces.filters,
        fetchingWorkspace: state.workspaces.fetchingWorkspace,
        users: state.auth.users,
        currentUser: state.auth.user
    }
}

export default connect(mapStateToProps, {fetchWorkspaceData}) (Workspace);
