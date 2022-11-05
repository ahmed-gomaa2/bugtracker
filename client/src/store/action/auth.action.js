import axios from 'axios';
import {LOAD_USER_FAIL, LOAD_USER_SUCCESS, REGISTER_USER_FAIL, REGISTER_USER_SUCCESS} from "./action.types";
import setHeadersHelper from "../../utls/set.headers.helper";

export const loadUser = () => async dispatch => {
    try{
        const token = localStorage.getItem('token');
        console.log(token);
        setHeadersHelper(token);

        const user = await axios.get('/load-user');
        console.log(user);

        dispatch({
            type: LOAD_USER_SUCCESS,
            user: user.data
        });
    }catch (e) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: e.response.data.error
        })
    }
}

export const register = userData => async dispatch => {
    try{
        const data = await axios.post('/register', userData);
        console.log(data);
        dispatch({
            type: REGISTER_USER_SUCCESS,
            token: data.data.token
        });

        await dispatch(loadUser());
    }catch (e) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: e.response.data.error
        })
    }
}
