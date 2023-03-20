import * as actionTypes from '../action/action.types';

const initialState = {
    toggleSidebar: false,
    toggleWorkspaceCreate: false,
    toggleWorkspaceEdit: false,
    editedWorkspaceId: null,
    toggleTaskOpen: false,

}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_SIDE_BAR:
            return {
                ...state,
                toggleSidebar: !state.toggleSidebar
            }
        case actionTypes.TOGGLE_WORKSPACE_CREATE_FORM:
            return {
                ...state,
                toggleWorkspaceCreate: !state.toggleWorkspaceCreate
            }
        case actionTypes.TOGGLE_WORKSPACE_EDIT_FORM:
            return {
                ...state,
                toggleWorkspaceEdit: !state.toggleWorkspaceEdit,
                editedWorkspaceId: action.id
            }
        case actionTypes.TOGGLE_TASK_OPEN:
            return {
                ...state,
                toggleTaskOpen:!state.toggleTaskOpen
            }
        default:
            return state;
    }
}
