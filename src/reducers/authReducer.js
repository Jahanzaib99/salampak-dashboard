import {
    SET_CURRENT_USER,
    SIGNUP_SUCCESS,
    GET_USER_PERMISSIONS,
    GET_USER_PERMISSIONS_SUCCESS,
    GET_USER_PERMISSIONS_FAILURE,
    LOG_OUT
} from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
    isAuthenticated: false,
    user: {},
    type: {},
    userPermissions: {},
    error: false,
    isLoading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload.userId,
                type: action.payload.userType,
                profile: action.payload.profile
            };
        case SIGNUP_SUCCESS:
            return {
                ...state,
                signUpIsCompleted: action.payload
            };
        case LOG_OUT:
            return {
                ...state,
                userPermissions: {},
            };

        case GET_USER_PERMISSIONS:
            return {
                ...state,
                userPermissions: {},
                isLoading: true
            };
        case GET_USER_PERMISSIONS_SUCCESS:
            return {
                ...state,
                userPermissions: action.payload,
                isLoading: false,
                error: false,
            };
        case GET_USER_PERMISSIONS_FAILURE:
            return {
                ...state,
                userPermissions: {},
                error: action.payload,
                isLoading: false
            };


        default:
            return state;
    }
}
