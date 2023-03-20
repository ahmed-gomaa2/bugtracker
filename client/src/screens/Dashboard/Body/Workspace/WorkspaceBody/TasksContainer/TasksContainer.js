import React, {useState} from 'react';
import './TasksContainer.scss';
import {connect} from "react-redux";
import TaskRow from "./TaskRow/TaskRow";

const tableHeads = [
    'Title',
    // 'Description',
    'Type',
    'Status',
    // 'Solution',
    'Start',
    'End',
    'Priority',
    'Assignees',
    'delete'
]

const TasksContainer = props => {
    const [owner, setOwner] = useState(false);
    return (
        <div className={'TasksContainer col-xl-6 col-lg-6 col-md-8'}>
            <table className="TasksContainer__table">
                {/*<thead className="TasksContainer__table--header">*/}
                    <tr className="TasksContainer__table--header">
                        {
                            tableHeads.map((k, i) => {
                                if(k === 'delete' && !owner) {
                                    return;
                                } else {
                                    return <th key={i} className="TasksContainer__table--header-head">{k}</th>
                                }
                            }
                            )
                        }
                    </tr>
                {/*</thead>*/}
                {/*<tbody>*/}
                    {
                        props.tasks.length > 0 && props.tasks.map((t, i) => (
                            <TaskRow setOwner={setOwner} task={t} key={i} />
                        ))
                    }
                {/*</tbody>*/}
            </table>
            {/*<table>*/}
            {/*    <tr>*/}
            {/*        <th>Name</th>*/}
            {/*        <th>Agefffffffffffffffffffffffffff</th>*/}
            {/*        <th>Gender</th>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>Anom</td>*/}
            {/*        <td>19</td>*/}
            {/*        <td>Male</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>Megha</td>*/}
            {/*        <td>19</td>*/}
            {/*        <td>Female</td>*/}
            {/*    </tr>*/}
            {/*    <tr>*/}
            {/*        <td>Subham</td>*/}
            {/*        <td>25</td>*/}
            {/*        <td>Male</td>*/}
            {/*    </tr>*/}
            {/*</table>*/}
        </div>
    );
};

// const mapStateToProps = state => {
//     return {
//         tasks: state.workspaces.filteredWorkspaceTasks
//     }
// }

export default TasksContainer;