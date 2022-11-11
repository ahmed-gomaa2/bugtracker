import axios from 'axios';
import {
    CREATE_WORKSPACE_FAIL, CREATE_WORKSPACE_SUCCESS,
    DELETE_WORKSPACE_FAIL,
    DELETE_WORKSPACE_SUCCESS, EDIT_WORKSPACE_FAIL, EDIT_WORKSPACE_SUCCESS,
    FETCH_USER_WORKSPACE_FAIL,
    FETCH_USER_WORKSPACE_SUCCESS
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
