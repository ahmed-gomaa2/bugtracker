import * as actionTypes from '../action/action.types';

const initialState = {
    alerts: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_ALERT:
            return {
                ...state,
                alerts: [...state.alerts, action.payload]
            }
        case actionTypes.REMOVE_ALERT:
            return {
                ...state,
                alerts: state.alerts.filter(alert => alert.id !== action.payload)
            }
        default:
            return state;
    }
}