import React from 'react';
import {connect} from "react-redux";
import TaskRow from "../Workspace/WorkspaceBody/TasksContainer/TaskRow/TaskRow";
import TasksContainer from "../Workspace/WorkspaceBody/TasksContainer/TasksContainer";
import Filters from "../Workspace/WorkspaceBody/Filters/Filters";


const TasksList = (props) => {
    return (
        <div className={'TasksList my-5'}>
            <div className="TaskList__header mb-1">
                <h2>Tasks</h2>
            </div>
            <Filters />
            <TasksContainer tasks={props.tasks} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        tasks: state.workspaces.tasksAssignedToMeFiltered
    }
}

export default connect(mapStateToProps) (TasksList);