import axios from 'axios';
import {
    LOAD_USER_END,
    LOAD_USER_FAIL,
    LOAD_USER_START,
    LOAD_USER_SUCCESS,
    LOGIN_USER_FAIL, LOGIN_USER_SUCCESS,
    REGISTER_USER_FAIL,
    REGISTER_USER_SUCCESS, RESET_FORM_AUTH
} from "./action.types";
import setHeadersHelper from "../../utls/set.headers.helper";
import {fetchWorkspaces} from "./workspace.action";

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

export const loadUser = () => async dispatch => {
    try{
        dispatch(loadUserStart());
        const token = localStorage.getItem('token');
        setHeadersHelper(token);

        const user = await axios.get('/load-user');
        dispatch({
            type: LOAD_USER_SUCCESS,
            user: user.data
        });

        await dispatch(fetchWorkspaces());

        dispatch(loadUserEnd());
    }catch (e) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: e.response.data.error
        })
        dispatch(loadUserEnd());
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

        await dispatch(loadUser());
    }catch (e) {
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: e.response.data.error
        });
    }
}

export const resetForm = () => {
    return {
        type: RESET_FORM_AUTH
    }
}
