import React from 'react';
import Filters from "./Filters/Filters";
import TasksContainer from "./TasksContainer/TasksContainer";
import './WorkspaceBody.scss'

const WorkspaceBody = props => {
    return (
        <div className={'WorkspaceBody'}>
            <Filters />
            <TasksContainer />
        </div>
    );
};

export default WorkspaceBody;