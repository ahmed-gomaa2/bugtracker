import {combineReducers} from "redux";
import authReducer from "./auth.reducer";

const initialState = {
    msg: 'Hello from the store!'
}

const initialReducer = (state = initialState) => {
    return state;
}

export default combineReducers({
    msg: initialReducer,
    auth: authReducer
})
