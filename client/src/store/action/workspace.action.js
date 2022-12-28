import axios from 'axios';
import {
    ADD_ENGINEER_TO_TASK_FAIL, ADD_ENGINEER_TO_TASK_SUCCESS,
    CHANGE_FILTER,
    CREATE_WORKSPACE_FAIL,
    CREATE_WORKSPACE_SUCCESS,
    DELETE_WORKSPACE_FAIL,
    DELETE_WORKSPACE_SUCCESS,
    EDIT_WORKSPACE_FAIL,
    EDIT_WORKSPACE_SUCCESS,
    FETCH_USER_WORKSPACE_FAIL,
    FETCH_USER_WORKSPACE_SUCCESS,
    FETCH_WORKSPACE_DATA_FAIL,
    FETCH_WORKSPACE_DATA_SUCCESS, REMOVE_ENGINEER_FROM_TASK_FAIL, REMOVE_ENGINEER_FROM_TASK_SUCCESS,
    START_FETCHING_WORKSPACE_END,
    START_FETCHING_WORKSPACE_START
} from "./action.types";

export const fetchWorkspaces = () => async dispatch => {
    try{
        const workspaces = await axios.get('/fetch-workspaces');
        dispatch({
            type: FETCH_USER_WORKSPACE_SUCCESS,
            workspaces: workspaces.data
        });
    }catch (e) {
        dispatch({
            type: FETCH_USER_WORKSPACE_FAIL,
            error: e.response.data.error
        })
    }
}

export const deleteWorkspace = id => async dispatch => {
    try {
        const deleted_id = await axios.delete('/workspace/delete/' + id);

        dispatch({
            type: DELETE_WORKSPACE_SUCCESS,
            id: deleted_id.data
        });
    }catch (e) {
        dispatch({
            type: DELETE_WORKSPACE_FAIL,
            error: e.response.data.error
        })
    }
}

export const createWorkspace = workspace => async dispatch => {
    try {
        const workspace_data = await axios.post('/create-workspace', workspace);
        dispatch({
            type: CREATE_WORKSPACE_SUCCESS,
            workspace: workspace_data.data.workspaceData
        })
    }catch (e) {
        console.log(e);
        dispatch({
            type: CREATE_WORKSPACE_FAIL,
            error: e
        })
    }
}

export const editWorkspace = workspace => async dispatch => {
    try {
        const editedWorkspace = await axios.put('/edit-workspace', workspace);

        dispatch({
            type: EDIT_WORKSPACE_SUCCESS,
            workspace: editedWorkspace.data
        })
    }catch (e) {
        dispatch({
            type: EDIT_WORKSPACE_FAIL,
            error: e.response.data.error
        });
    }
}

const startFetchingWrokspace = () => {
    return {
        type: START_FETCHING_WORKSPACE_START
    }
}

const endFetchingWrokspace = () => {
    return {
        type: START_FETCHING_WORKSPACE_END
    }
}

export const fetchWorkspaceData = id => async dispatch => {
    try {
        dispatch(startFetchingWrokspace());
        const workspaceData = await axios.get('/workspace/' + id);
        console.log(workspaceData);
        dispatch({
            type: FETCH_WORKSPACE_DATA_SUCCESS,
            workspace: workspaceData.data
        })
        dispatch(endFetchingWrokspace());
    }catch (e) {
        dispatch({
            type: FETCH_WORKSPACE_DATA_FAIL
        })
        dispatch(endFetchingWrokspace());
    }
}

export const filterTasks = (changedFilter, newValue) => {
    return {
        type: CHANGE_FILTER,
        filter: changedFilter,
        value: newValue
    }
}

export const removeEngineer = (user_id, task_id, workspace_id) => async dispatch => {
    try {
        const data = {
            user_id: user_id,
            task_id: task_id,
            workspace_id: workspace_id
        }
        console.log(data);

        const res = await axios.put('/workspace/delete-engineer', data);
        dispatch({
            type: REMOVE_ENGINEER_FROM_TASK_SUCCESS,
            task_id: res.data.task_id,
            user_id: res.data.user_id,
            workspace_id: res.data.workspace_id
        });
    }catch (e) {
        dispatch({
            type: REMOVE_ENGINEER_FROM_TASK_FAIL
        })
    }
}

export const addEngineerToTask = (user_id, task_id, workspace_id) => async dispatch => {
    try {
        const data = {
            user_id,
            task_id,
            workspace_id
        };

        const res = await axios.put('/workspace/add-engineer', data);

        dispatch({
            type: ADD_ENGINEER_TO_TASK_SUCCESS,
            user_data: res.data,
            task_id: res.data.task_id,
            workspace_id: res.data.workspace_id
        });
    }catch(e) {
        dispatch({
            type: ADD_ENGINEER_TO_TASK_FAIL
        })
    }
}