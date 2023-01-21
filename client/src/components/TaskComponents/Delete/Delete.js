import React from 'react';
import './Delete.scss';
import {connect} from "react-redux";
import {deleteTask} from "../../../store/action/workspace.action";

const Delete = (props) => {
    const taskDeleteHandler = async e => {
        e.preventDefault();
        await props.deleteTask(props.task.workspace_id, props.task.id);
    }
    return (
        <td className={'Delete'}>
            <p><i onClick={taskDeleteHandler} className="fa-solid fa-trash"></i></p>
        </td>
    );
};

export default connect(null, {deleteTask}) (Delete);