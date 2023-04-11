import axios from 'axios';
import {
    CREATE_SOCKET_SUCCESS,
    FETCH_ALL_USERS_FAIL, FETCH_ALL_USERS_SUCCESS,
    LOAD_USER_END,
    LOAD_USER_FAIL,
    LOAD_USER_START,
    LOAD_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_SUCCESS,
    REGISTER_USER_FAIL,
    REGISTER_USER_SUCCESS,
    RESET_EVERYTHING,
    RESET_FORM_AUTH,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    STORE_RESET_EMAIL
} from "./action.types";
import setHeadersHelper from "../../utls/set.headers.helper";
import {
    addEngineerHandler,
    addTaskToAssignedTasks,
    changeEndDateAssigned,
    changeTaskAssignedToMePriority,
    changeTaskAssignedToMeType,
    changeTaskStatus,
    fetchWorkspaces,
    getTasksAssignedToMe,
    removeEngineerHandler
} from "./workspace.action";
import io from 'socket.io-client';
import {setAlert} from "./notifications.action";
import React from "react";

const loadUserStart = () => {
    return {
        type: LOAD_USER_START
    }
}

const loadUserEnd = () => {
    return {
        type: LOAD_USER_END
    }
}

export const loadUser = (navigate) => async dispatch => {
    try{
        dispatch(loadUserStart());
        const token = localStorage.getItem('token');
        setHeadersHelper(token);

        const user = await axios.get('/load-user');
        dispatch({
            type: LOAD_USER_SUCCESS,
            user: user.data
        });

        dispatch(fetchAllUsers());

        dispatch(fetchWorkspaces());

        dispatch(getTasksAssignedToMe());

        if(user.status === 200) {
            const socket = io.connect('http://localhost:8080/');
            await dispatch({
                type: CREATE_SOCKET_SUCCESS,
                socket: socket
            });

            socket.emit('join_room', user.data.id);

            socket.on('engineer_removed', data => {
                dispatch(setAlert(`${user.data.id == data.user_id ? 'You have ' : `${data.task.engineers.filter(e => e.id == data.user_id)[0].username} has `}been removed from the ${data.task.title} task. 🥹`, 'danger'));
                dispatch(removeEngineerHandler(data.task, data.user_id, user.data.id))
            });

            socket.on('engineer_added', data => {
                console.log(data);
                dispatch(addEngineerHandler(data.task, data.user_id, user.data.id));
                dispatch(setAlert(`${data.user_id == user.data.id ? 'You have ' : `${data.task.engineers.filter(e => e.id == data.user_id)[0].username} has`} been added to ${data.task.title} task. 🎉`, 'success'))
            });
            socket.on('create_task', data => {
                console.log(data);
                dispatch(addTaskToAssignedTasks(data.task));
                dispatch(setAlert(`${data.task.title} has been created 🎉`, 'success'));
            });

            (() => {
                const types= {
                    1: {
                        name: 'bug',
                        icon: <i className="fa-solid fa-bug"></i>
                    },

                    2: {
                        name: 'feature',
                        icon: <i className="fa-solid fa-microchip"></i>
                    },
                    3: {
                        name: 'task',
                        icon: <i className="fa-solid fa-list-check"></i>
                    }
                }
                socket.on('change_type', data => {
                    data.task.type = data.type;
                    dispatch(changeTaskAssignedToMeType(data.task));
                    dispatch(setAlert(`${data.task.title}'s title was changed to ${types[data.type].name}`, 'success'))
                })
            })();
            (() => {
                const status = {
                    1: {
                        name: 'not started',
                        icon: <i className="fa-solid fa-face-sad-tear"></i>
                    },
                    2: {
                        name: 'in progress',
                        icon: <i className="fa-solid fa-laptop-code"></i>
                    },
                    3: {
                        name: 'to be tested',
                        icon: <i className="fa-solid fa-circle-pause"></i>
                    },
                    4: {
                        name: 'done',
                        icon: <i className="fa-solid fa-face-smile"></i>
                    },
                }
                socket.on('change_status', data => {
                    data.task.status = data.status;
                    console.log(data);

                    if(data.status == 4) {
                        dispatch(setAlert(`Well done ${data.task.title}'s has been completed 🎉`, 'success'))
                    }else {
                        dispatch(setAlert(`${data.task.title}'s status was changed to ${status[data.status].name}`, 'primary'))
                    }

                    dispatch(changeTaskStatus(data.task, user.data));
                })
            })();

            socket.on('change_date', data => {
                data.task.end_date = data.end_date;
                const date = new Date(data.end_date).toLocaleDateString('en-CA');
                dispatch(setAlert(`${data.task.title}'s end date was changed to ${date}`, 'primary'))
                dispatch(changeEndDateAssigned(data.task));
            });
            (() => {
                const priorities = {
                    1: 'high',
                    2: 'medium',
                    3: 'low'
                }
                socket.on('change_priority', data => {
                    data.task.priority = data.priority;
                    dispatch(setAlert(`${data.task.title}'s priority was changed to ${priorities[data.priority]}`, 'primary'));
                    dispatch(changeTaskAssignedToMePriority(data.task));
                });
            })();
        }

        dispatch(loadUserEnd());
    }catch (e) {
        if(e.response.data.error.type === 'jwt') {
            dispatch(setAlert('Please, Login again!', 'primary'))
            navigate('/login');
        }
        dispatch({
            type: LOAD_USER_FAIL,
            payload: e.response.data.error
        })
        dispatch(loadUserEnd());
    }
}

const fetchAllUsers = () => async dispatch => {
    try{
        const users = await axios.get('/fetch-users');

        dispatch({
            type: FETCH_ALL_USERS_SUCCESS,
            usersData: users.data
        });
    }catch (e) {
        dispatch({
            type: FETCH_ALL_USERS_FAIL
        })
    }
}

export const register = userData => async dispatch => {
    try{
        const data = await axios.post('/register', userData);
        dispatch({
            type: REGISTER_USER_SUCCESS,
            token: data.data.token
        });

        await dispatch(loadUser());
    }catch (e) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: e.response.data.error
        });
    }
}

export const login = userData => async dispatch => {
    try {
        const res = await axios.post('/login', userData);
        dispatch({
            type: LOGIN_USER_SUCCESS,
            token: res.data.token
        });

        console.log(res);

        await dispatch(loadUser());

        if(res.status == 200) {
            dispatch(setAlert('Welcome back!', 'success'));
        }
    }catch (e) {
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: e.response.data.error
        });
    }
}

export const sendCode = (formData, navigate) => async dispatch => {
    try {
        const response = await axios.post('/send-email', formData);
        dispatch({
            type: STORE_RESET_EMAIL,
            email: formData.email
        })
        navigate('/verify-code');
    }catch (e) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            error: e.response.data.error
        })
    }
}

export const resetPassword = (code, newPassword, email, navigate) => async dispatch => {
    try{
        const body = {
            code,
            password: newPassword,
            email
        }
        const res = await axios.put('/reset-password', body);
        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            msg: res.data
        });
        navigate('/login');
    }catch (e) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            error: e.response.data.error
        })
    }
}

export const resetForm = () => {
    return {
        type: RESET_FORM_AUTH
    }
}

export const resetEverything = () => {
    return {
        type: RESET_EVERYTHING
    }
}
