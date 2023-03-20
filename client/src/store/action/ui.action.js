import {
    TOGGLE_SIDE_BAR,
    TOGGLE_TASK_OPEN,
    TOGGLE_WORKSPACE_CREATE_FORM,
    TOGGLE_WORKSPACE_EDIT_FORM
} from "./action.types";

export const toggleSidebar = () => {
    console.log('action triggered')
    return {
        type: TOGGLE_SIDE_BAR
    }
}

export const toggleWorkspaceCreateForm = () => {
    return {
        type: TOGGLE_WORKSPACE_CREATE_FORM
    }
}

export const toggleWorkspaceEditForm = id => {
    return {
        type: TOGGLE_WORKSPACE_EDIT_FORM,
        id: id
    }
}

export const toggleTaskOpen = () => {
    return {
        type: TOGGLE_TASK_OPEN
    }
}