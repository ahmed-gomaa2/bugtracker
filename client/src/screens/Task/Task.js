import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {fetchWorkspaceData} from "../../store/action/workspace.action";

const Task = props => {
    const [task, setTask] = useState({});
    const params = useParams();
    const {task_id, workspace_id} = params;
    useEffect(() => {
        // if(!props.workspace) {
        //     props.fetchWorkspaceData(workspace_id);
        // }
    }, []);

    return (
        <div className={'Task'}>

        </div>
    );
};

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps, {}) (Task);