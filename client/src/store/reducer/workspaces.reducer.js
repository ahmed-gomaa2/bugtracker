import * as actionTypes from '../action/action.types';
import {
    FETCH_WORKSPACE_DATA_SUCCESS,
    START_FETCHING_WORKSPACE_END,
    START_FETCHING_WORKSPACE_START
} from "../action/action.types";
import filters from "../../screens/Dashboard/Body/Workspace/WorkspaceBody/Filters/Filters";

const initialState = {
    workspaces: [],
    error: null,
    currentWorkspaceData: null,
    currentWorkspaceTasks: [],
    filteredWorkspaceTasks: [],
    fetchingWorkspace: true,
    filters: {
        type: 0,
        status: 0,
        priority: 0
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case START_FETCHING_WORKSPACE_START:
            return {
                ...state,
                fetchingWorkspace: true
            }
        case START_FETCHING_WORKSPACE_END:
            return {
                ...state,
                fetchingWorkspace: false
            }
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
        case actionTypes.FETCH_WORKSPACE_DATA_SUCCESS:
            return {
                ...state,
                currentWorkspaceData: action.workspace.workspaceInfo,
                currentWorkspaceTasks: action.workspace.workspaceTasks,
                filteredWorkspaceTasks: action.workspace.workspaceTasks,
                filters: {
                    type: 0,
                    status: 0,
                    priority: 0
                }
            }
        case actionTypes.CHANGE_FILTER:
            const filtersCopy = {...state.filters}
            filtersCopy[action.filter]  = action.value;
            const tasksCopy = [...state.currentWorkspaceTasks];
            console.log(tasksCopy)
            const filteredTasks = tasksCopy.filter(t => {
                console.log((t.type == filtersCopy.type || filtersCopy.type == 0) && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || t.priority == 0))
                return (t.type == filtersCopy.type || filtersCopy.type == 0)  && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || filtersCopy.priority == 0);
            })
            console.log(filteredTasks)
            return {
                ...state,
                filters: filtersCopy,
                filteredWorkspaceTasks: filteredTasks
            }
        case actionTypes.REMOVE_ENGINEER_FROM_TASK_SUCCESS:
            let modifiedTask = {...state.currentWorkspaceTasks.filter(t => t.id === action.task_id)[0]};
            modifiedTask = {
                ...modifiedTask,
                engineers: [...modifiedTask.engineers.filter(eng => eng.user_id !== action.user_id)]
            };
            console.log(modifiedTask);
            const filteredWorkspaceTasksCopy = [...state.filteredWorkspaceTasks];
            console.log(filteredWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0])
            const indexOfTask = filteredWorkspaceTasksCopy.indexOf(filteredWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0]);
            filteredWorkspaceTasksCopy[indexOfTask] = modifiedTask;
            const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
            const indexOfTaskInCurrent = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0]);
            currentWorkspaceTasksCopy[indexOfTaskInCurrent] = modifiedTask;
            console.log(currentWorkspaceTasksCopy, filteredWorkspaceTasksCopy)
            return {
                ...state,
                currentWorkspaceTasks: currentWorkspaceTasksCopy,
                filteredWorkspaceTasks: filteredWorkspaceTasksCopy
            }

        case actionTypes.ADD_ENGINEER_TO_TASK_SUCCESS:
            let modifiedTaskToAdd = {...state.currentWorkspaceTasks.filter(t => t.id === action.task_id)[0]};
            modifiedTaskToAdd = {
                ...modifiedTaskToAdd,
                engineers: [...modifiedTaskToAdd.engineers, action.user_data]
            }
            const currentWorkspaceTasksAnotherCopy = [...state.currentWorkspaceTasks];
            const indexOfTaskInCurrentAnotherCopy = currentWorkspaceTasksAnotherCopy.indexOf(currentWorkspaceTasksAnotherCopy.filter(t => t.id === action.task_id)[0]);
            currentWorkspaceTasksAnotherCopy[indexOfTaskInCurrentAnotherCopy] = modifiedTaskToAdd;
            const filteredWorkspaceTasksAnotherCopy = [...state.filteredWorkspaceTasks];
            const indexOfTaskFilteredAnotherCopy = filteredWorkspaceTasksAnotherCopy.indexOf(filteredWorkspaceTasksAnotherCopy.filter(t => t.id === action.task_id)[0]);
            filteredWorkspaceTasksAnotherCopy[indexOfTaskFilteredAnotherCopy] = modifiedTaskToAdd;
            return {
                ...state,
                currentWorkspaceTasks: currentWorkspaceTasksAnotherCopy,
                filteredWorkspaceTasks: filteredWorkspaceTasksAnotherCopy
            }
        default:
            return state;
    }
}
