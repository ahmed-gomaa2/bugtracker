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
                workspaces: workspacesCopy,
                currentWorkspaceData: action.workspace
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
            const filteredTasks = tasksCopy.filter(t => {
                return (t.type == filtersCopy.type || filtersCopy.type == 0)  && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || filtersCopy.priority == 0);
            })
            return {
                ...state,
                filters: filtersCopy,
                filteredWorkspaceTasks: filteredTasks
            }
        case actionTypes.REMOVE_ENGINEER_FROM_TASK_SUCCESS:
            return (() => {
                let modifiedTask = {...state.currentWorkspaceTasks.filter(t => t.id === action.task_id)[0]};
                modifiedTask = {
                    ...modifiedTask,
                    engineers: [...modifiedTask.engineers.filter(eng => eng.user_id !== action.user_id)]
                };
                const filteredWorkspaceTasksCopy = [...state.filteredWorkspaceTasks];
                const indexOfTask = filteredWorkspaceTasksCopy.indexOf(filteredWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0]);
                filteredWorkspaceTasksCopy[indexOfTask] = modifiedTask;
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const indexOfTaskInCurrent = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0]);
                currentWorkspaceTasksCopy[indexOfTaskInCurrent] = modifiedTask;
                return {
                    ...state,
                    currentWorkspaceTasks: currentWorkspaceTasksCopy,
                    filteredWorkspaceTasks: filteredWorkspaceTasksCopy
                }

            })();
        case actionTypes.ADD_ENGINEER_TO_TASK_SUCCESS:
            return (() => {
                let modifiedTask = {...state.currentWorkspaceTasks.filter(t => t.id === action.task_id)[0]};
                modifiedTask = {
                    ...modifiedTask,
                    engineers: [...modifiedTask.engineers, action.user_data]
                }
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const taskIndexInCurrentWorkspaceTasks = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0]);
                currentWorkspaceTasksCopy[taskIndexInCurrentWorkspaceTasks] = modifiedTask;
                const filteredWorkspaceTasksCopy = [...state.filteredWorkspaceTasks];
                const taskIndexInFilteredTasks = filteredWorkspaceTasksCopy.indexOf(filteredWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0]);
                filteredWorkspaceTasksCopy[taskIndexInFilteredTasks] = modifiedTask;
                return {
                    ...state,
                    currentWorkspaceTasks: currentWorkspaceTasksCopy,
                    filteredWorkspaceTasks: filteredWorkspaceTasksCopy
                }
            })();

        case actionTypes.CHANGE_TASK_TYPE_SUCCESS:
            return (() => {
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const modifiedTask = {...currentWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0]};
                modifiedTask.type = +action.newType;
                const taskIndexInCurrentWorkspaceTasks = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t=> t.id === action.task_id)[0]);
                currentWorkspaceTasksCopy[taskIndexInCurrentWorkspaceTasks] = modifiedTask;
                const filteredWorkspaceTasksCopy = [...state.filteredWorkspaceTasks];
                const taskIndexInFilteredWorkspaceTasks = filteredWorkspaceTasksCopy.indexOf(filteredWorkspaceTasksCopy.filter(t => t.id === action.task_id)[0]);
                filteredWorkspaceTasksCopy[taskIndexInFilteredWorkspaceTasks] = modifiedTask;
                const filtersCopy = {...state.filters}
                const filteredTasks = filteredWorkspaceTasksCopy.filter(t => {
                    return (t.type == filtersCopy.type || filtersCopy.type == 0)  && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || filtersCopy.priority == 0);
                })
                return {
                    ...state,
                    currentWorkspaceTasks: currentWorkspaceTasksCopy,
                    filteredWorkspaceTasks: filteredTasks
                }
            })();
        case actionTypes.CHANGE_TASK_STATUS_SUCCESS:
            return (() => {
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const modifiedTask = {...currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]};
                modifiedTask.status = +action.newStatus;
                const taskIndexInCurrentWorkspaceTasks = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]);
                currentWorkspaceTasksCopy[taskIndexInCurrentWorkspaceTasks] = modifiedTask;
                const filteredTasksCopy = [...state.filteredWorkspaceTasks];
                const taskIndexInFilteredTasks = filteredTasksCopy.indexOf(filteredTasksCopy.filter(t => t.id == action.task_id)[0]);
                filteredTasksCopy[taskIndexInFilteredTasks] = modifiedTask;
                const filtersCopy = {...state.filters}
                const filteredTasks = filteredTasksCopy.filter(t => {
                    return (t.type == filtersCopy.type || filtersCopy.type == 0)  && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || filtersCopy.priority == 0);
                });
                return {
                    ...state,
                    currentWorkspaceTasks: currentWorkspaceTasksCopy,
                    filteredWorkspaceTasks: filteredTasks
                }
            })();
        case actionTypes.CHANGE_TASK_PRIORITY_SUCCESS:
            return (() => {
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const modifiedTask = {...currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]};
                modifiedTask.priority = +action.newPriority;
                const taskIndexInsideCurrentWorkspaceTasks = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]);
                currentWorkspaceTasksCopy[taskIndexInsideCurrentWorkspaceTasks] = modifiedTask;
                const filteredTasksCopy = [...state.filteredWorkspaceTasks];
                const taskIndexInsideFilteredTasksCopy = filteredTasksCopy.indexOf(filteredTasksCopy.filter(t => t.id == action.task_id)[0]);
                filteredTasksCopy[taskIndexInsideFilteredTasksCopy] = modifiedTask;
                const filtersCopy = {...state.filters};
                const filteredTasks = filteredTasksCopy.filter(t => {
                    return (t.type == filtersCopy.type || filtersCopy.type == 0)  && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || filtersCopy.priority == 0);
                });
                return {
                    ...state,
                    filteredWorkspaceTasks: filteredTasks,
                    currentWorkspaceTasks: currentWorkspaceTasksCopy
                }
            })();
        case actionTypes.CHANGE_TASK_END_DATE_SUCCESS:
            return (() => {
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const modifiedTask = {...currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]};
                modifiedTask.end_date = action.newDate;
                const taskIndexInsideCurrentTasksCopy = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]);
                currentWorkspaceTasksCopy[taskIndexInsideCurrentTasksCopy] = modifiedTask;
                const filteredTasksCopy = [...state.filteredWorkspaceTasks];
                const taskIndexInFilteredTasksCopy = filteredTasksCopy.indexOf(filteredTasksCopy.filter(t => t.id == action.task_id)[0]);
                filteredTasksCopy[taskIndexInFilteredTasksCopy] = modifiedTask;
                return {
                    ...state,
                    currentWorkspaceTasks: currentWorkspaceTasksCopy,
                    filteredWorkspaceTasks: filteredTasksCopy
                }
            })();
        case actionTypes.CREATE_TASK_SUCCESS:
            return (() => {
                const filteredTasksCopy = [...state.filteredWorkspaceTasks];
                const filtersCopy = {...state.filters};

                if((action.newTask.type == filtersCopy.type || filtersCopy.type == 0) && (action.newTask.status == filtersCopy.status || filtersCopy.status == 0) && (action.newTask.priority == filtersCopy.priority || filtersCopy.priority == 0)) {
                    filteredTasksCopy.push(action.newTask);
                }

                return {
                    ...state,
                    currentWorkspaceTasks: [...state.currentWorkspaceTasks, action.newTask],
                    filteredWorkspaceTasks: filteredTasksCopy
                }
            })();
        default:
            return state;
    }
}
