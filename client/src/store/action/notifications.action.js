import { v4 as uuidv4 } from 'uuid';
import {REMOVE_ALERT, SET_ALERT} from "./action.types";

export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
    const id = uuidv4();
    console.log(id);
    dispatch({
        type: SET_ALERT,
        payload: {msg, alertType, id}
    });

    setTimeout(() => dispatch({type: REMOVE_ALERT, payload: id}), timeout);
}