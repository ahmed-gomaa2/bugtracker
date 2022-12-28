import React, {useEffect} from 'react';
import './Workspace.scss';
import WorkspaceToolbar from "./WorkspaceToolbar/WorkspaceToolbar";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {fetchWorkspaceData} from "../../../../store/action/workspace.action";
import Toolbar from "../../../../components/HOC/Toolbar/Toolbar";
import WorkspaceBody from "./WorkspaceBody/WorkspaceBody";
import Spinner from "../../../../components/UI/Spinner/Spinner";

const Workspace = props => {
    const {workspace_id} = useParams();

    useEffect(() => {
        console.log(workspace_id, props.tasks);
        if(workspace_id) {
            props.fetchWorkspaceData(workspace_id);
        }
    }, [workspace_id]);

    return (
        <div className={'Workspace'}>
            {props.fetchingWorkspace ? (
                <Spinner />
            ) : (
                <>
                    <Toolbar>
                        <WorkspaceToolbar ws={props.workspaceInfo}/>
                    </Toolbar>
                    <WorkspaceBody />
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
        fetchingWorkspace: state.workspaces.fetchingWorkspace
    }
}

export default connect(mapStateToProps, {fetchWorkspaceData}) (Workspace);
