import * as actionTypes from '../action/action.types';

const initialState = {
    workspaces: [],
    error: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_WORKSPACE_SUCCESS:
            console.log(action);
            return {
                ...state,
                workspaces: [...state.workspaces, action.workspace]
            }
        case actionTypes.FETCH_USER_WORKSPACE_SUCCESS:
            return {
                ...state,
                workspaces: action.workspaces
            }
        case actionTypes.DELETE_WORKSPACE_SUCCESS:
            const remainedWorkspaces = state.workspaces.filter(ws => ws.id !== action.id);

            return {
                ...state,
                workspaces: remainedWorkspaces
            }
        case actionTypes.DELETE_WORKSPACE_FAIL:
            return {
                ...state,
                error: action.error
            }
        case actionTypes.EDIT_WORKSPACE_SUCCESS:
            const workspacesCopy = [...state.workspaces];
            const index = workspacesCopy.map(ws => ws.id).indexOf(action.workspace.id);
            workspacesCopy[index] = action.workspace;
            return {
                ...state,
                workspaces: workspacesCopy
            }

        default:
            return state;
    }
}
