import React from 'react';
import Filters from "./Filters/Filters";
import TasksContainer from "./TasksContainer/TasksContainer";
import './WorkspaceBody.scss'
import {connect} from "react-redux";

const WorkspaceBody = props => {
    return (
        <div className={'WorkspaceBody'}>
            <Filters type={0} />
            <TasksContainer tasks={props.tasks} />
        </div>
    );
};

const mapStateToProps = state => {
    return {
        tasks: state.workspaces.filteredWorkspaceTasks
    }
}

export default connect(mapStateToProps) (WorkspaceBody);