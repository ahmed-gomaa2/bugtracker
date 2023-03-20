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
import {addEngineerHandler, fetchWorkspaces, getTasksAssignedToMe, removeEngineerHandler} from "./workspace.action";
import io from 'socket.io-client';
import {setAlert} from "./notifications.action";

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

        await dispatch(fetchAllUsers());

        await dispatch(fetchWorkspaces());

        await dispatch(getTasksAssignedToMe());

        if(user.status === 200) {
            const socket = io.connect('http://localhost:8080/');
            await dispatch({
                type: CREATE_SOCKET_SUCCESS,
                socket: socket
            });

            socket.emit('join_room', user.data.id);

            socket.on('engineer_removed', data => {
                dispatch(setAlert(`${user.data.id == data.user_id ? 'You have ' : `${data.task.engineers.filter(e => e.id == data.user_id)[0].username} has `}been removed from the ${data.task.title} task.`, 'danger'));
                dispatch(removeEngineerHandler(data.task, data.user_id, user.data.id))
            });

            socket.on('engineer_added', data => {
                console.log(data);
                dispatch(addEngineerHandler(data.task, data.user_id, user.data.id));
                dispatch(setAlert(`${data.user_id == user.data.id ? 'You have ' : `${data.task.engineers.filter(e => e.id == data.user_id)[0].username} has`} been added to ${data.task.title} task.`, 'success'))
            });
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
