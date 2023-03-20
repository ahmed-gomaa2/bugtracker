import * as actionTypes from '../action/action.types';

const initialState = {
    user: null,
    users: [],
    authenticated: false,
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
    resetEmail: null,
    socket: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.REGISTER_USER_SUCCESS:
        case actionTypes.LOGIN_USER_SUCCESS:
            localStorage.setItem('token', action.token);
            return {
                ...state,
                loading: false,
                authenticated: true,
                error: null
            }
        case actionTypes.CREATE_SOCKET_SUCCESS:
            return {
                ...state,
                socket: action.socket
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.usersData
            }
        case actionTypes.REGISTER_USER_FAIL:
        case actionTypes.LOGIN_USER_FAIL:
            return {
                ...state,
                error: {
                    type: action.payload.type,
                    msg: action.payload.msg
                }
            }
        case actionTypes.LOAD_USER_FAIL:
            return {
                ...state,
                authenticated: false,
                user: null,
            }
        case actionTypes.LOAD_USER_SUCCESS:
            return {
                ...state,
                user: action.user,
                authenticated: true
            }
        case actionTypes.RESET_FORM_AUTH:
            return {
                ...state,
                error: null
            }
        case actionTypes.LOAD_USER_START:
            return {
                ...state,
                loading: true
            }
        case actionTypes.LOAD_USER_END:
            return {
                ...state,
                loading: false
            }
        case actionTypes.RESET_EVERYTHING:
            return {
                ...state,

            }
        case actionTypes.STORE_RESET_EMAIL:
            return {
                ...state,
                resetEmail: action.email
            }
        case actionTypes.RESET_PASSWORD_FAIL: {
            return {
                ...state,
                error: action.error
            }
        }
        default:
            return state;
    }
}
