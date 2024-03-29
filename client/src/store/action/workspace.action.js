import axios from 'axios';
import {
    ADD_ENGINEER_HANDLER,
    ADD_ENGINEER_TO_TASK_FAIL,
    ADD_ENGINEER_TO_TASK_SUCCESS,
    ADD_TASK_TO_ASSIGNED_TASKS,
    CHANGE_FILTER,
    CHANGE_FILTER_ASSIGNED,
    CHANGE_FILTER_WORKSPACE, CHANGE_TASK__SOLUTION,
    CHANGE_TASK__STATUS,
    CHANGE_TASK_ASSIGNED_TO_ME_DATE, CHANGE_TASK_ASSIGNED_TO_ME_DESCRIPTION,
    CHANGE_TASK_ASSIGNED_TO_ME_PRIORITY, CHANGE_TASK_ASSIGNED_TO_ME_TITLE,
    CHANGE_TASK_ASSIGNED_TO_ME_TYPE,
    CHANGE_TASK_DESCRIPTION_FAIL,
    CHANGE_TASK_DESCRIPTION_SUCCESS,
    CHANGE_TASK_END_DATE_FAIL,
    CHANGE_TASK_END_DATE_SUCCESS,
    CHANGE_TASK_PRIORITY_FAIL,
    CHANGE_TASK_PRIORITY_SUCCESS,
    CHANGE_TASK_SOLUTION_FAIL,
    CHANGE_TASK_SOLUTION_SUCCESS,
    CHANGE_TASK_STATUS_FAIL,
    CHANGE_TASK_STATUS_SUCCESS,
    CHANGE_TASK_TITLE_FAIL,
    CHANGE_TASK_TITLE_SUCCESS,
    CHANGE_TASK_TYPE_FAIL,
    CHANGE_TASK_TYPE_SUCCESS,
    CREATE_TASK_FAIL,
    CREATE_TASK_SUCCESS,
    CREATE_WORKSPACE_FAIL,
    CREATE_WORKSPACE_SUCCESS,
    DELETE_TASK_FAIL,
    DELETE_TASK_SUCCESS,
    DELETE_WORKSPACE_FAIL,
    DELETE_WORKSPACE_SUCCESS,
    EDIT_WORKSPACE_FAIL,
    EDIT_WORKSPACE_SUCCESS,
    FETCH_USER_WORKSPACE_FAIL,
    FETCH_USER_WORKSPACE_SUCCESS,
    FETCH_WORKSPACE_DATA_FAIL,
    FETCH_WORKSPACE_DATA_SUCCESS,
    GET_TASKS_ASSIGNED_TO_ME_FAIL,
    GET_TASKS_ASSIGNED_TO_ME_SUCCESS,
    REMOVE_ENGINEER_FROM_TASK_FAIL,
    REMOVE_ENGINEER_FROM_TASK_SUCCESS,
    REMOVE_ENGINEER_HANDLER, START_FETCHING_TASKS_ASSIGNED_TO_ME,
    START_FETCHING_WORKSPACE_END,
    START_FETCHING_WORKSPACE_START, START_FETCHING_WORKSPACES,
    TASK_ID_CHANGE_SUCCESS
} from "./action.types";
import {loadUser} from "./auth.action";

export const startFetchingWorkspaces = () => {
    return {
        type: START_FETCHING_WORKSPACES
    }
}

export const fetchWorkspaces = () => async dispatch => {
    try{
        dispatch(startFetchingWorkspaces());
        const workspaces = await axios.get('/fetch-workspaces');
        dispatch({
            type: FETCH_USER_WORKSPACE_SUCCESS,
            workspaces: workspaces.data
        });
        dispatch(startFetchingWorkspaces());
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: FETCH_USER_WORKSPACE_FAIL,
            error: e.response.data.error
        })
    }
}

export const deleteWorkspace = (id, navigate) => async dispatch => {
    try {
        const deleted_id = await axios.delete('/workspace/delete/' + id);

        dispatch({
            type: DELETE_WORKSPACE_SUCCESS,
            id: deleted_id.data
        });
        navigate('/dashboard')
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
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
        });
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
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
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
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
        dispatch({
            type: FETCH_WORKSPACE_DATA_SUCCESS,
            workspace: workspaceData.data
        })
        dispatch(endFetchingWrokspace());
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: FETCH_WORKSPACE_DATA_FAIL
        })
        dispatch(endFetchingWrokspace());
    }
}

export const filterWorkspaceTasks = (changedFilter, newValue) => {
    return {
        type: CHANGE_FILTER_WORKSPACE,
        filter: changedFilter,
        value: newValue
    }
}

export const filterAssignedTasks = (changedFilter, newValue) => {
    return {
        type: CHANGE_FILTER_ASSIGNED,
        filter: changedFilter,
        value: newValue
    }
}

export const removeEngineerHandler = (task, user_id, currentUserId) => dispatch => {
    dispatch({
        type: REMOVE_ENGINEER_HANDLER,
        task,
        user_id,
        currentUserId
    });
}

export const removeEngineer = (user_id, task_id, workspace_id, socket, engineers, task) => async dispatch => {
    try {
        console.log(user_id, task_id, workspace_id, socket, engineers, task)
        const data = {
            user_id: user_id,
            task_id: task_id,
            workspace_id: workspace_id
        }

        const res = await axios.put('/workspace/delete-engineer', data);
        dispatch({
            type: REMOVE_ENGINEER_FROM_TASK_SUCCESS,
            task_id: res.data.task_id,
            user_id: res.data.user_id,
            workspace_id: res.data.workspace_id
        });

        if(res.status === 200) {
            const engineersData = {
                engineers,
                user_id,
                task
            }
            socket.emit('remove_engineer', engineersData);
        }

    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: REMOVE_ENGINEER_FROM_TASK_FAIL
        })
    }
}

export const addEngineerHandler = (task, user_id, currentUserId) => dispatch => {
    dispatch({
        type: ADD_ENGINEER_HANDLER,
        task,
        user_id,
        currentUserId
    });
}

export const addEngineerToTask = (user_id, task_id, workspace_id, socket, task, user) => async dispatch => {
    try {
        const data = {
            user_id,
            task_id,
            workspace_id
        };

        const res = await axios.put('/workspace/add-engineer', data);

        dispatch({
            type: ADD_ENGINEER_TO_TASK_SUCCESS,
            user_data: {
                ...user,
                task_id
            },
            task_id: res.data.task_id,
            workspace_id: res.data.workspace_id
        });

        task.engineers.push({
            ...user,
            task_id
        });

        const socketData = {
            task,
            user_id,
        }

        socket.emit('add-engineer', socketData);
    }catch(e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: ADD_ENGINEER_TO_TASK_FAIL
        })
    }
}

export const changeTaskAssignedToMeType = task => {
    return {
        type: CHANGE_TASK_ASSIGNED_TO_ME_TYPE,
        newTask: task
    }
}

export const changeType = (task, type, workspace_id, navigate, socket) => async dispatch => {
    try {
        const data = {
            id: task.id,
            type,
            workspace_id
        };

        const res = await axios.put('/workspace/edit-type', data);

        dispatch({
            type: CHANGE_TASK_TYPE_SUCCESS,
            newType: res.data.type,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id
        });

        if(res.status === 200) {
            const data = {
                engineers: task.engineers,
                task: task,
                type: type
            };

            socket.emit('change-type', data);
        }
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_TYPE_FAIL
        })
    }
}

export const changeTaskStatus = (task, currentUser) => dispatch => {
    console.log(task);
    console.log(dispatch)
    dispatch({
        type: CHANGE_TASK_STATUS_SUCCESS,
        newStatus: task.status,
        task_id: task.id,
        workspace_id: task.workspace_id
    });
}

export const changeStatus = (task, status, workspace_id, owner, socket) => async dispatch => {
    try {
        const data = {
            id: task.id,
            status,
            workspace_id
        };

        const res = await axios.put('/workspace/edit-status', data);
        dispatch({
            type: CHANGE_TASK_STATUS_SUCCESS,
            newStatus: res.data.status,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id
        });
        if(res.status === 200) {
            const data = {
                engineers: [
                    ...task.engineers,
                ],
                currentUser: owner,
                status,
                task
            };
            console.log(data);

            socket.emit('change-status', data);
        }
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_STATUS_FAIL
        })
    }
}

export const changeTaskAssignedToMePriority = task => {
    return {
        type: CHANGE_TASK_ASSIGNED_TO_ME_PRIORITY,
        task
    }
}

export const changePriority = (task, priority, workspace_id, socket) => async dispatch => {
    try{
        const data = {
            id: task.id,
            priority,
            workspace_id
        };
        const res = await axios.put('/workspace/edit-priority', data);
        dispatch({
            type: CHANGE_TASK_PRIORITY_SUCCESS,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id,
            newPriority: res.data.priority
        });

        if(res.status === 200) {
            const socketData = {
                task,
                priority
            };

            socket.emit('change-priority', socketData);
        }
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_PRIORITY_FAIL
        })
    }
}

export const changeEndDateAssigned = task => {
    return {
        type: CHANGE_TASK_ASSIGNED_TO_ME_DATE,
        task
    }
}

export const changeEndDate = (task, end_date, workspace_id, socket) => async dispatch => {
    try {
        const data = {
            id: task.id,
            end_date,
            workspace_id
        };

        const res = await axios.put('/workspace/edit-end-date', data);
        dispatch({
            type: CHANGE_TASK_END_DATE_SUCCESS,
            workspace_id: res.data.workspace_id,
            newDate: res.data.end_date,
            task_id: res.data.id
        });

        console.log(res);

        if(res.status === 200) {
            console.log(200);
            const socketData = {
                task,
                end_date
            };

            console.log(socketData, socket);

            socket.emit('change-date', socketData);
        }
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_END_DATE_FAIL
        });
    }
}

export const getTask = (workspace_id, id) => async dispatch => {
    try {

    }catch (e) {

    }
}

export const addTaskToAssignedTasks = task => {
    return {
        type: ADD_TASK_TO_ASSIGNED_TASKS,
        newTask: task
    }
}

export const createTask = (taskData, socket) => async dispatch => {
    try {
        const data = {
            ...taskData,
            solution: '',
            status: 1,
            start_date: new Date()
        };

        const res = await axios.post('/workspace/create-task', data);
        dispatch({
            type: CREATE_TASK_SUCCESS,
            newTask: res.data
        });

        if(res.status === 200) {
            const data = {
                engineers: res.data.engineers,
                task: res.data
            };

            console.log(socket, data);

            socket.emit('create-task', data);
        }

    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CREATE_TASK_FAIL
        })
    }
}

export const deleteTask = (workspace_id, task_id) => async dispatch => {
    try {
        const res = await axios.delete(`/workspace/${workspace_id}/task/${task_id}`);
        dispatch({
            type: DELETE_TASK_SUCCESS,
            task_id: +res.data.task_id,
            workspace_id: +res.data.workspace_id
        });
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: DELETE_TASK_FAIL
        })
    }
}

export const changeSelectedTask = task => {
    return {
        type: TASK_ID_CHANGE_SUCCESS,
        task: task
    }
}

export const changeTaskAssignedTitle = task => {
    return {
        type: CHANGE_TASK_ASSIGNED_TO_ME_TITLE,
        task
    }
}

export const changeTitle = (newTitle, task, workspace_id, socket) => async dispatch => {
    try {
        const data = {
            title: newTitle,
            id: task.id,
            workspace_id
        }
        const res = await axios.put('/workspace/edit-title', data);
        dispatch({
            type: CHANGE_TASK_TITLE_SUCCESS,
            newTitle: res.data.title,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id
        });

        if(res.status === 200) {
            const socketData = {
                task,
                title: newTitle
            };

            console.log(socket, socketData);
            socket.emit('change-title', socketData);
        }
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_TITLE_FAIL
        })
    }
}

export const changeTaskAssignedToMeDescription = task => {
    return {
        type: CHANGE_TASK_ASSIGNED_TO_ME_DESCRIPTION,
        task
    }
}

export const changeDescription = (newDescription, task, workspace_id, socket) => async dispatch => {
    try {
        const data = {
            description: newDescription,
            id: task.id,
            workspace_id
        };

        const res = await axios.put('/workspace/edit-description', data);

        dispatch({
            type: CHANGE_TASK_DESCRIPTION_SUCCESS,
            newDescription: res.data.description,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id
        });

        if(res.status === 200) {
            const socketData = {
                task,
                newDescription
            };

            socket.emit('change-description', socketData);
        }
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({ type: CHANGE_TASK_DESCRIPTION_FAIL})
    }
}

export const changeTaskSolution = task => {
    return {
        type: CHANGE_TASK__SOLUTION,
        task
    }
}

export const changeSolution = (newSolution, task, workspace_id, socket, currentUser) => async dispatch => {
    try {
        const data = {
            solution: newSolution,
            id: task.id,
            workspace_id
        };

        const res = await axios.put('/workspace/edit-solution', data);

        dispatch({
            type: CHANGE_TASK_SOLUTION_SUCCESS,
            newSolution: res.data.solution,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id,
            task
        });

        if(res.status === 200) {
            const socketData = {
                task,
                newSolution,
                currentUser
            };

            socket.emit('change-solution', socketData);

        }
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_SOLUTION_FAIL
        })
    }
}

export const startFetchingTasksAssignedToMe = () => {
    return {
        type: START_FETCHING_TASKS_ASSIGNED_TO_ME
    }
}

export const getTasksAssignedToMe = () => async dispatch => {
    try {
        dispatch(startFetchingTasksAssignedToMe());
        const res = await axios.get('/assigned/tasks');
        dispatch({
            type: GET_TASKS_ASSIGNED_TO_ME_SUCCESS,
            tasks: res.data
        });
        dispatch(startFetchingTasksAssignedToMe());
    } catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: GET_TASKS_ASSIGNED_TO_ME_FAIL
        })
    }
}