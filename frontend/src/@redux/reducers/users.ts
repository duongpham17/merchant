import { ACTIONS, TYPES, INITIALSTATE_USER } from '@redux/types/users';

const initialState: INITIALSTATE_USER = {
    user: null,
    users: null,
    status: {},
    errors: {},
};

export const user = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.USER_LOGIN:
            return{
                ...state,
                user: payload
            };  
        case TYPES.USER_FIND:
            return{
                ...state,
                users: payload
            };  
        case TYPES.USER_UPDATE:
            return{
                ...state,
                users: state.users ? state.users.map(el => el._id === payload._id ? payload: el) : [payload]
            };  
        case TYPES.USER_RESPONSE_STATUS:
            return{
                ...state,
                status: payload
            };
        case TYPES.USER_RESPONSE_ERROR:
            return{
                ...state,
                errors: payload
            }
        case TYPES.USER_RESPONSE_CLEAR:
            return{
                ...state,
                status: {},
                errors: {}
            }
        case TYPES.USER_STATE_CLEAR:
            return{
                ...state,
                [payload.key]: payload.value
            }

        default: 
            return state;
    }
}

export default user;