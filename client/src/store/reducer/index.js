import {combineReducers} from "redux";
import authReducer from "./auth.reducer";
import workspacesReducer from "./workspaces.reducer";
import uiReducer from "./ui.reducer";
import notificationsReducer from "./notifications.reducer";

const initialState = {
    msg: 'Hello from the store!'
}

const initialReducer = (state = initialState) => {
    return state;
}

export default combineReducers({
    msg: initialReducer,
    auth: authReducer,
    workspaces: workspacesReducer,
    ui: uiReducer,
    notifications: notificationsReducer
});
