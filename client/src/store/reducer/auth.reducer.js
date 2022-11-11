import * as actionTypes from '../action/action.types';

const initialState = {
    user: null,
    authenticated: false,
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
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
        case actionTypes.REGISTER_USER_FAIL:
        case actionTypes.LOGIN_USER_FAIL:
            return {
                ...state,
                error: {
                    type: action.payload.type,
                    msg: action.payload.msg
                }
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
        default:
            return state;
    }
}
