import * as actionTypes from '../action/action.types';
import {
    FETCH_WORKSPACE_DATA_SUCCESS,
    START_FETCHING_WORKSPACE_END,
    START_FETCHING_WORKSPACE_START, START_FETCHING_WORKSPACES
} from "../action/action.types";
import filters from "../../screens/Dashboard/Body/Workspace/WorkspaceBody/Filters/Filters";

const initialState = {
    workspaces: [],
    error: null,
    currentWorkspaceData: null,
    currentWorkspaceTasks: [],
    filteredWorkspaceTasks: [],
    currentSelectedTask: {},
    tasksAssignedToMe: [],
    tasksAssignedToMeFiltered: [],
    fetchingWorkspace: true,
    fetchingTasksAssignedToMe: false,
    fetchingWorkspaces: false,
    workspaceFilters: {
        type: 0,
        status: 0,
        priority: 0
    },
    assignedFilters: {
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
        case actionTypes.CHANGE_FILTER_WORKSPACE:
            return (() => {
                const filtersCopy = {...state.workspaceFilters}
                filtersCopy[action.filter]  = action.value;
                const tasksCopy = [...state.currentWorkspaceTasks];
                const filteredTasks = tasksCopy.filter(t => {
                    return (t.type == filtersCopy.type || filtersCopy.type == 0)  && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || filtersCopy.priority == 0);
                });
                return {
                    ...state,
                    workspaceFilters: filtersCopy,
                    filteredWorkspaceTasks: filteredTasks,
                }
            })();
        case actionTypes.CHANGE_FILTER_ASSIGNED:
            return (() => {
                const filtersCopy = {...state.assignedFilters}
                filtersCopy[action.filter] = action.value;
                const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                const tasksAssignedToMeFilteredCopy = tasksAssignedToMeCopy.filter(t => {
                    return (t.type == filtersCopy.type || filtersCopy.type == 0)  && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || filtersCopy.priority == 0);
                });
                return {
                    ...state,
                    assignedFilters: filtersCopy,
                    tasksAssignedToMeFiltered: tasksAssignedToMeFilteredCopy
                }
            })();
        case actionTypes.REMOVE_ENGINEER_FROM_TASK_SUCCESS:
            return (() => {
                let modifiedTask = {...state.currentWorkspaceTasks.filter(t => t.id === action.task_id)[0]};
                modifiedTask = {
                    ...modifiedTask,
                    engineers: [...modifiedTask.engineers.filter(eng => eng.id !== action.user_id)]
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
                    filteredWorkspaceTasks: filteredWorkspaceTasksCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task_id ? modifiedTask : state.currentSelectedTask
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
                    filteredWorkspaceTasks: filteredWorkspaceTasksCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task_id ? modifiedTask : state.currentSelectedTask
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
                    filteredWorkspaceTasks: filteredTasks,
                    currentSelectedTask: state.currentSelectedTask.id == action.task_id? modifiedTask : state.currentSelectedTask
                }
            })();
        case actionTypes.CHANGE_TASK_STATUS_SUCCESS:
            return (() => {
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const modifiedTask = currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0];
                if(modifiedTask) {
                    console.log(modifiedTask);
                    modifiedTask.status = +action.newStatus;
                    const taskIndexInCurrentWorkspaceTasks = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]);
                    currentWorkspaceTasksCopy[taskIndexInCurrentWorkspaceTasks] = modifiedTask;
                    const filteredTasksCopy = [...state.filteredWorkspaceTasks];
                    const taskIndexInFilteredTasks = filteredTasksCopy.indexOf(filteredTasksCopy.filter(t => t.id == action.task_id)[0]);
                    filteredTasksCopy[taskIndexInFilteredTasks] = modifiedTask;
                    const filtersCopy = {...state.workspaceFilters}
                    const filteredTasks = filteredTasksCopy.filter(t => {
                        return (t.type == filtersCopy.type || filtersCopy.type == 0)  && (t.status == filtersCopy.status || filtersCopy.status == 0) && (t.priority == filtersCopy.priority || filtersCopy.priority == 0);
                    });
                    const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                    const taskIndexInAssignedToMeTasks = tasksAssignedToMeCopy.indexOf(tasksAssignedToMeCopy.filter(t => t.id == action.task_id)[0]);
                    tasksAssignedToMeCopy[taskIndexInAssignedToMeTasks] = modifiedTask;

                    const tasksAssignedToMeFilteredCopy = [...state.tasksAssignedToMeFiltered];
                    const taskIndexInAssignedToMeFilteredTasks = tasksAssignedToMeFilteredCopy.indexOf(tasksAssignedToMeFilteredCopy.filter(t => t.id == action.task_id)[0]);
                    if(taskIndexInAssignedToMeFilteredTasks > 0) {
                        tasksAssignedToMeFilteredCopy[taskIndexInAssignedToMeFilteredTasks] = modifiedTask;
                    }

                    const assignedFiltersCopy = {...state.assignedFilters}
                    const filteredAssignedTasks = tasksAssignedToMeFilteredCopy.filter(t => {
                        return (t.type == assignedFiltersCopy.type || assignedFiltersCopy.type == 0)  && (t.status == assignedFiltersCopy.status || assignedFiltersCopy.status == 0) && (t.priority == assignedFiltersCopy.priority || assignedFiltersCopy.priority == 0);
                    });
                    return {
                        ...state,
                        currentWorkspaceTasks: currentWorkspaceTasksCopy,
                        filteredWorkspaceTasks: filteredTasks,
                        currentSelectedTask: state.currentSelectedTask.id == action.task_id? modifiedTask : state.currentSelectedTask,
                        tasksAssignedToMe: tasksAssignedToMeCopy,
                        tasksAssignedToMeFiltered: filteredAssignedTasks
                    }
                } else {
                    const assignedTasksCopy = [...state.tasksAssignedToMe];
                    const modifiedTask = assignedTasksCopy.filter(t=> t.id == action.task_id)[0];
                    if(!modifiedTask) return state;
                    modifiedTask.status = +action.newStatus;
                    console.log(modifiedTask);
                    const taskIndexInAssignedToMeTasks = assignedTasksCopy.indexOf(assignedTasksCopy.filter(t => t.id == action.task_id)[0]);
                    assignedTasksCopy[taskIndexInAssignedToMeTasks] = modifiedTask;

                    const tasksAssignedToMeFilteredCopy = [...state.tasksAssignedToMeFiltered];
                    const taskIndexInAssignedToMeFilteredTasks = tasksAssignedToMeFilteredCopy.indexOf(tasksAssignedToMeFilteredCopy.filter(t => t.id == action.task_id)[0]);
                    if(taskIndexInAssignedToMeFilteredTasks > 0) {
                        tasksAssignedToMeFilteredCopy[taskIndexInAssignedToMeFilteredTasks] = modifiedTask;
                    }

                    const assignedFiltersCopy = {...state.assignedFilters}
                    const filteredAssignedTasks = tasksAssignedToMeFilteredCopy.filter(t => {
                        return (t.type == assignedFiltersCopy.type || assignedFiltersCopy.type == 0)  && (t.status == assignedFiltersCopy.status || assignedFiltersCopy.status == 0) && (t.priority == assignedFiltersCopy.priority || assignedFiltersCopy.priority == 0);
                    });

                    return {
                        ...state,
                        currentSelectedTask: state.currentSelectedTask.id == action.task_id? modifiedTask : state.currentSelectedTask,
                        tasksAssignedToMe: assignedTasksCopy,
                        tasksAssignedToMeFiltered: filteredAssignedTasks
                    }
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
                    currentWorkspaceTasks: currentWorkspaceTasksCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task_id? modifiedTask : state.currentSelectedTask
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
                    filteredWorkspaceTasks: filteredTasksCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task_id? modifiedTask : state.currentSelectedTask
                }
            })();
        case actionTypes.CREATE_TASK_SUCCESS:
            return (() => {
                const filteredTasksCopy = [...state.filteredWorkspaceTasks];
                const filtersCopy = {...state.workspaceFilters};

                if((action.newTask.type == filtersCopy.type || filtersCopy.type == 0) && (action.newTask.status == filtersCopy.status || filtersCopy.status == 0) && (action.newTask.priority == filtersCopy.priority || filtersCopy.priority == 0)) {
                    filteredTasksCopy.push(action.newTask);
                }

                return {
                    ...state,
                    currentWorkspaceTasks: [...state.currentWorkspaceTasks, action.newTask],
                    filteredWorkspaceTasks: filteredTasksCopy
                }
            })();

        case actionTypes.DELETE_TASK_SUCCESS:
            return (()=> {
                return {
                    ...state,
                    currentWorkspaceTasks: [...state.currentWorkspaceTasks.filter(t => t.id !== action.task_id)],
                    filteredWorkspaceTasks: [...state.filteredWorkspaceTasks.filter(t => t.id !== action.task_id)]
                }
            })();
        case actionTypes.TASK_ID_CHANGE_SUCCESS:
            return {
                ...state,
                // currentSelectedTask: state.currentWorkspaceTasks.filter(t => t.id == action.id)[0]
                currentSelectedTask: action.task
            }
        case actionTypes.CHANGE_TASK_TITLE_SUCCESS:
            return (() => {
                const modifiedTask = {...state.currentWorkspaceTasks.filter(t => t.id == action.task_id)[0]};
                modifiedTask.title = action.newTitle;
                console.log(modifiedTask);
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const taskIndexInCurrentWorkspaceTasksCopy = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]);
                currentWorkspaceTasksCopy[taskIndexInCurrentWorkspaceTasksCopy] = modifiedTask;
                const filteredTasksCopy = [...state.filteredWorkspaceTasks];
                const taskIndexInFilteredTasksCopy = filteredTasksCopy.indexOf(filteredTasksCopy.filter(t => t.id == action.task_id)[0]);
                filteredTasksCopy[taskIndexInFilteredTasksCopy] = modifiedTask;
                return {
                    ...state,
                    filteredWorkspaceTasks: filteredTasksCopy,
                    currentWorkspaceTasks: currentWorkspaceTasksCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task_id ? modifiedTask : state.currentSelectedTask
                }
            })();
        case actionTypes.CHANGE_TASK_DESCRIPTION_SUCCESS:
            return (() => {
                const modifiedTask = {...state.currentWorkspaceTasks.filter(t => t.id == action.task_id)[0]};
                modifiedTask.description = action.newDescription;
                const currentWorkspaceTasksCopy = [...state.currentWorkspaceTasks];
                const taskIndexInCurrentWorkspaceTasksCopy = currentWorkspaceTasksCopy.indexOf(currentWorkspaceTasksCopy.filter(t => t.id == action.task_id)[0]);
                currentWorkspaceTasksCopy[taskIndexInCurrentWorkspaceTasksCopy] = modifiedTask;
                const filteredTasksCopy = [...state.filteredWorkspaceTasks];
                const taskIndexInFilteredTasksCopy = filteredTasksCopy.indexOf(filteredTasksCopy.filter(t => t.id == action.task_id)[0]);
                filteredTasksCopy[taskIndexInFilteredTasksCopy] = modifiedTask;
                return {
                    ...state,
                    filteredWorkspaceTasks: filteredTasksCopy,
                    currentWorkspaceTasks: currentWorkspaceTasksCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task_id ? modifiedTask : state.currentSelectedTask
                }
            })();
        case actionTypes.CHANGE_TASK_SOLUTION_SUCCESS:
            return (() => {
                const indexInCurrentWorkspaceTasks = state.currentWorkspaceTasks.indexOf(t => t.id == action.task.id);
                indexInCurrentWorkspaceTasks !== -1 && (state.currentWorkspaceTasks[indexInCurrentWorkspaceTasks].solution = action.newSolution);
                const indexInCurrentWorkspaceFilteredTasks = state.filteredWorkspaceTasks.indexOf(t => t.id == action.task.id);
                indexInCurrentWorkspaceFilteredTasks !== -1 && (state.filteredWorkspaceTasks[indexInCurrentWorkspaceFilteredTasks].solution = action.newSolution);
                const indexInAssignedToMeTasks = state.tasksAssignedToMe.indexOf(t => t.id == action.task.id);
                indexInAssignedToMeTasks !== -1 && (state.tasksAssignedToMe[indexInAssignedToMeTasks].solution = action.newSolution);
                const indexInAssignedToMeTasksFiltered = state.tasksAssignedToMeFiltered.indexOf(t => t.id == action.task.id);
                indexInAssignedToMeTasksFiltered !== -1 && (state.tasksAssignedToMeFiltered[indexInAssignedToMeTasksFiltered].solution = action.newSolution);
                return {
                    ...state,
                    currentWorkspaceTasks: [...state.filteredWorkspaceTasks],
                    filteredWorkspaceTasks: [...state.filteredWorkspaceTasks],
                    tasksAssignedToMe: [...state.tasksAssignedToMe],
                    tasksAssignedToMeFiltered: [...state.tasksAssignedToMeFiltered],
                    currentSelectedTask: state.currentSelectedTask.id == action.task.id ? {...state.currentSelectedTask, solution: action.newSolution} : state.currentSelectedTask
                }
            })();
        case actionTypes.GET_TASKS_ASSIGNED_TO_ME_SUCCESS:
            return (() => {
                const tasksCopy = [...action.tasks.filter(t => t.type )];
                return {
                    ...state,
                    tasksAssignedToMe: action.tasks,
                    tasksAssignedToMeFiltered: tasksCopy
                }
            })();
        case actionTypes.REMOVE_ENGINEER_HANDLER:
            return (() => {
                if(action.user_id == action.currentUserId) {
                    action.task.owner = false;
                    return {
                        ...state,
                        tasksAssignedToMe: state.tasksAssignedToMe.filter(t => t.id != action.task.id),
                        tasksAssignedToMeFiltered: state.tasksAssignedToMeFiltered.filter(t => t.id != action.task.id)
                    }
                } else {
                    const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                    const changedTask = tasksAssignedToMeCopy.filter(t => t.id == action.task.id)[0];
                    changedTask.engineers = changedTask.engineers.filter(e => e.id != action.user_id);
                    changedTask.owner = false;
                    console.log(action.user_id);
                    const taskIndexInTasksAssignedToMeCopy = tasksAssignedToMeCopy.indexOf(tasksAssignedToMeCopy.filter(t => t.id == action.task.id)[0]);
                    tasksAssignedToMeCopy[taskIndexInTasksAssignedToMeCopy] = changedTask;
                    const tasksAssignedToMeFilteredCopy = [...state.tasksAssignedToMeFiltered];
                    const taskIndexInAssignedToMeFilteredCopy = tasksAssignedToMeFilteredCopy.indexOf(tasksAssignedToMeFilteredCopy.filter(t => t.id == action.task.id)[0]);
                    tasksAssignedToMeFilteredCopy[taskIndexInAssignedToMeFilteredCopy] = changedTask;

                    return {
                        ...state,
                        tasksAssignedToMe: tasksAssignedToMeCopy,
                        tasksAssignedToMeFiltered: tasksAssignedToMeFilteredCopy,
                        currentSelectedTask: state.currentSelectedTask.id == action.task.id ? {...changedTask} : state.currentSelectedTask
                    }
                }
            })();
        case actionTypes.ADD_ENGINEER_HANDLER:
            return (() => {
                if(action.user_id == action.currentUserId) {
                    // const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                    // tasksAssignedToMeCopy.push(action.task);
                    action.task.owner = false;
                    return {
                        ...state,
                        tasksAssignedToMe: [...state.tasksAssignedToMe, action.task],
                        tasksAssignedToMeFiltered: [...state.tasksAssignedToMeFiltered, action.task]
                    }
                } else {
                    const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                    let changedTask = tasksAssignedToMeCopy.filter(t => t.id == action.task.id)[0];
                    changedTask = action.task;
                    changedTask.owner = false;
                    const taskIndexInTasksAssignedToMeCopy = tasksAssignedToMeCopy.indexOf(tasksAssignedToMeCopy.filter(t => t.id == action.task.id)[0]);
                    tasksAssignedToMeCopy[taskIndexInTasksAssignedToMeCopy] = changedTask;
                    const tasksAssignedToMeFilteredCopy = [...state.tasksAssignedToMeFiltered];
                    const taskIndexInAssignedToMeFilteredCopy = tasksAssignedToMeFilteredCopy.indexOf(tasksAssignedToMeFilteredCopy.filter(t => t.id == action.task.id)[0]);
                    tasksAssignedToMeFilteredCopy[taskIndexInAssignedToMeFilteredCopy] = changedTask;

                    return {
                        ...state,
                        tasksAssignedToMe: tasksAssignedToMeCopy,
                        tasksAssignedToMeFiltered: tasksAssignedToMeFilteredCopy,
                        currentSelectedTask: action.task.id == state.currentSelectedTask.id ? {...changedTask} : state.currentSelectedTask
                    }
                }
            })();
        case actionTypes.ADD_TASK_TO_ASSIGNED_TASKS:
            return (() => {
                const filtersCopy = {
                    ...state.assignedFilters
                }
                action.newTask.owner = false;
                return {
                    ...state,
                    tasksAssignedToMe: [...state.tasksAssignedToMe, action.task],
                    tasksAssignedToMeFiltered: ((action.newTask.type == filtersCopy.type || filtersCopy.type == 0) && (action.newTask.status == filtersCopy.status || filtersCopy.status == 0) && (action.newTask.priority == filtersCopy.priority || filtersCopy.priority == 0)) ? [...state.tasksAssignedToMeFiltered, action.newTask] : state.tasksAssignedToMeFiltered
                }
            })();
        case actionTypes.CHANGE_TASK_ASSIGNED_TO_ME_TYPE:
            return (() => {
                console.log(action.newTask);
                const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                const modifiedTask = tasksAssignedToMeCopy.filter(t => t.id == action.newTask.id)[0];
                if(!modifiedTask) return state;
                modifiedTask.type = action.newTask.type;
                const modifiedTaskIndex = tasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndex == -1) return state;
                tasksAssignedToMeCopy[modifiedTaskIndex] = modifiedTask;
                const filteredTasksAssignedToMeCopy = [...state.tasksAssignedToMeFiltered];
                const modifiedTaskIndexInsideFilteredTasks = filteredTasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndexInsideFilteredTasks == -1) return state;
                filteredTasksAssignedToMeCopy[modifiedTaskIndexInsideFilteredTasks] = modifiedTask;
                return {
                    ...state,
                    tasksAssignedToMe: tasksAssignedToMeCopy,
                    tasksAssignedToMeFiltered: filteredTasksAssignedToMeCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.newTask.id ? {...modifiedTask} : state.currentSelectedTask
                }
            })();
            case actionTypes.CHANGE_TASK_ASSIGNED_TO_ME_DATE:
            return (() => {
                console.log(action.task);
                const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                const modifiedTask = tasksAssignedToMeCopy.filter(t => t.id == action.task.id)[0];
                if(!modifiedTask) return state;
                modifiedTask.end_date = action.task.end_date;
                const modifiedTaskIndex = tasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndex == -1) return state;
                tasksAssignedToMeCopy[modifiedTaskIndex] = modifiedTask;
                const filteredTasksAssignedToMeCopy = [...state.tasksAssignedToMeFiltered];
                const modifiedTaskIndexInsideFilteredTasks = filteredTasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndexInsideFilteredTasks == -1) return state;
                filteredTasksAssignedToMeCopy[modifiedTaskIndexInsideFilteredTasks] = modifiedTask;
                return {
                    ...state,
                    tasksAssignedToMe: tasksAssignedToMeCopy,
                    tasksAssignedToMeFiltered: filteredTasksAssignedToMeCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task.id ? {...modifiedTask} : state.currentSelectedTask
                }
            })();
            case actionTypes.CHANGE_TASK_ASSIGNED_TO_ME_PRIORITY:
            return (() => {
                console.log(action.task);
                const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                const modifiedTask = tasksAssignedToMeCopy.filter(t => t.id == action.task.id)[0];
                if(!modifiedTask) return state;
                console.log(modifiedTask);
                modifiedTask.priority = action.task.priority;
                const modifiedTaskIndex = tasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndex == -1) return state;
                tasksAssignedToMeCopy[modifiedTaskIndex] = modifiedTask;
                const filteredTasksAssignedToMeCopy = [...state.tasksAssignedToMeFiltered];
                const modifiedTaskIndexInsideFilteredTasks = filteredTasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndexInsideFilteredTasks == -1) return state;
                filteredTasksAssignedToMeCopy[modifiedTaskIndexInsideFilteredTasks] = modifiedTask;
                if(action.task.id == state.currentSelectedTask.id) {
                    console.log('equal');
                }
                return {
                    ...state,
                    tasksAssignedToMe: tasksAssignedToMeCopy,
                    tasksAssignedToMeFiltered: filteredTasksAssignedToMeCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task.id ? {...modifiedTask} : state.currentSelectedTask
                }
            })();
        case actionTypes.START_FETCHING_TASKS_ASSIGNED_TO_ME:
            return {
                ...state,
                fetchingTasksAssignedToMe: !state.fetchingTasksAssignedToMe
            }
        case actionTypes.START_FETCHING_WORKSPACES:
            return {
                ...state,
                fetchingWorkspaces: !state.fetchingWorkspaces
            }

        case actionTypes.CHANGE_TASK_ASSIGNED_TO_ME_TITLE:
            return (() => {
                const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                const modifiedTask = {...tasksAssignedToMeCopy.filter(t => t.id == action.task.id)[0]};
                console.log(modifiedTask);
                if(!modifiedTask) return state;
                modifiedTask.title = action.task.title;
                const modifiedTaskIndex = tasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndex == -1) return state;
                tasksAssignedToMeCopy[modifiedTaskIndex] = modifiedTask;
                const filteredTasksAssignedToMeCopy = [...state.tasksAssignedToMeFiltered];
                const modifiedTaskIndexInsideFilteredTasks = filteredTasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndexInsideFilteredTasks == -1) return state;
                filteredTasksAssignedToMeCopy[modifiedTaskIndexInsideFilteredTasks] = modifiedTask;
                return {
                    ...state,
                    tasksAssignedToMe: tasksAssignedToMeCopy,
                    tasksAssignedToMeFiltered: filteredTasksAssignedToMeCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task.id ? {...state.currentSelectedTask, title: action.task.title} : state.currentSelectedTask
                }
            })();
        case actionTypes.CHANGE_TASK_ASSIGNED_TO_ME_DESCRIPTION:
            return (() => {
                const tasksAssignedToMeCopy = [...state.tasksAssignedToMe];
                const modifiedTask = {...tasksAssignedToMeCopy.filter(t => t.id == action.task.id)[0]};
                console.log(modifiedTask);
                if(!modifiedTask) return state;
                modifiedTask.description = action.task.description;
                const modifiedTaskIndex = tasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndex == -1) return state;
                tasksAssignedToMeCopy[modifiedTaskIndex] = modifiedTask;
                const filteredTasksAssignedToMeCopy = [...state.tasksAssignedToMeFiltered];
                const modifiedTaskIndexInsideFilteredTasks = filteredTasksAssignedToMeCopy.findIndex(t => t.id === modifiedTask.id);
                if(modifiedTaskIndexInsideFilteredTasks == -1) return state;
                filteredTasksAssignedToMeCopy[modifiedTaskIndexInsideFilteredTasks] = modifiedTask;
                return {
                    ...state,
                    tasksAssignedToMe: tasksAssignedToMeCopy,
                    tasksAssignedToMeFiltered: filteredTasksAssignedToMeCopy,
                    currentSelectedTask: state.currentSelectedTask.id == action.task.id ? {...state.currentSelectedTask, description: action.task.description} : state.currentSelectedTask
                }
            })();
        default:
            return state;
    }
}
