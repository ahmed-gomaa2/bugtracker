import axios from 'axios';
import {
    ADD_ENGINEER_HANDLER,
    ADD_ENGINEER_TO_TASK_FAIL,
    ADD_ENGINEER_TO_TASK_SUCCESS, ADD_TASK_TO_ASSIGNED_TASKS,
    CHANGE_FILTER,
    CHANGE_FILTER_ASSIGNED,
    CHANGE_FILTER_WORKSPACE,
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
    REMOVE_ENGINEER_FROM_TASK_SUCCESS, REMOVE_ENGINEER_HANDLER,
    START_FETCHING_WORKSPACE_END,
    START_FETCHING_WORKSPACE_START,
    TASK_ID_CHANGE_SUCCESS
} from "./action.types";
import {loadUser} from "./auth.action";

export const fetchWorkspaces = () => async dispatch => {
    try{
        const workspaces = await axios.get('/fetch-workspaces');
        dispatch({
            type: FETCH_USER_WORKSPACE_SUCCESS,
            workspaces: workspaces.data
        });
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

export const changeType = (id, type, workspace_id, navigate) => async dispatch => {
    try {
        const data = {
            id,
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
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_TYPE_FAIL
        })
    }
}

export const changeStatus = (id, status, workspace_id) => async dispatch => {
    try {
        const data = {
            id,
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
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_STATUS_FAIL
        })
    }
}

export const changePriority = (id, priority, workspace_id) => async dispatch => {
    try{
        const data = {
            id,
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
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_PRIORITY_FAIL
        })
    }
}

export const changeEndDate = (id, end_date, workspace_id) => async dispatch => {
    try {
        const data = {
            id,
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
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_END_DATE_FAIL
        })
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

export const changeTitle = (newTitle, task_id, workspace_id) => async dispatch => {
    try {
        const data = {
            title: newTitle,
            id: task_id,
            workspace_id
        }
        const res = await axios.put('/workspace/edit-title', data);
        dispatch({
            type: CHANGE_TASK_TITLE_SUCCESS,
            newTitle: res.data.title,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id
        });
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_TITLE_FAIL
        })
    }
}

export const changeDescription = (newDescription, task_id, workspace_id) => async dispatch => {
    try {
        const data = {
            description: newDescription,
            id: task_id,
            workspace_id
        };

        const res = await axios.put('/workspace/edit-description', data);

        dispatch({
            type: CHANGE_TASK_DESCRIPTION_SUCCESS,
            newDescription: res.data.description,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id
        });
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({ type: CHANGE_TASK_DESCRIPTION_FAIL})
    }
}

export const changeSolution = (newSolution, task_id, workspace_id) => async dispatch => {
    try {
        const data = {
            solution: newSolution,
            id: task_id,
            workspace_id
        };

        const res = await axios.put('/workspace/edit-solution', data);

        dispatch({
            type: CHANGE_TASK_SOLUTION_SUCCESS,
            newSolution: res.data.solution,
            task_id: res.data.id,
            workspace_id: res.data.workspace_id
        });
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: CHANGE_TASK_SOLUTION_FAIL
        })
    }
}

export const getTasksAssignedToMe = () => async dispatch => {
    try {
        const res = await axios.get('/assigned/tasks');
        dispatch({
            type: GET_TASKS_ASSIGNED_TO_ME_SUCCESS,
            tasks: res.data
        })
    } catch (e) {
        if(e.response.data.error.type === 'jwt') {
            await dispatch(loadUser())
        }
        dispatch({
            type: GET_TASKS_ASSIGNED_TO_ME_FAIL
        })
    }
}