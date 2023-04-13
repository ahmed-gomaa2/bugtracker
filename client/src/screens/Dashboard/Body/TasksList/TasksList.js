import React from 'react';
import {connect} from "react-redux";
import TaskRow from "../Workspace/WorkspaceBody/TasksContainer/TaskRow/TaskRow";
import TasksContainer from "../Workspace/WorkspaceBody/TasksContainer/TasksContainer";
import Filters from "../Workspace/WorkspaceBody/Filters/Filters";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import './TasksList.scss'

const TasksList = (props) => {
    return (
        <div className={'TasksList my-5'}>
            <div className="TaskList__header mb-1">
                <h2>Tasks</h2>
            </div>
            <Filters />
            <div style={{position: 'relative'}}>
                {
                    props.fetchingTasksAssignedToMe ? <Spinner /> : <TasksContainer tasks={props.tasks} />
                }
            </div>

        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        tasks: state.workspaces.tasksAssignedToMeFiltered,
        fetchingTasksAssignedToMe: state.workspaces.fetchingTasksAssignedToMe
    }
}

export default connect(mapStateToProps) (TasksList);