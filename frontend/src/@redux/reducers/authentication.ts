import { ACTIONS, TYPES, INITIALSTATE_AUTHENTICATION} from '@redux/types/authentication';

const initialState: INITIALSTATE_AUTHENTICATION = {
    isLoggedIn: false,
    status: {},
    errors: {}
};

export const authentication = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.AUTHENTICATION_LOAD_USER:
            return{
                ...state,
                isLoggedIn: payload
            }
        case TYPES.AUTHENTICATION_RESPONSE_STATUS:
            return{
                ...state,
                status: {...state.status, ...payload}
            }
        case TYPES.AUTHENTICATION_RESPONSE_ERROR:
            return{
                ...state,
                errors: {...state.errors, ...payload},
            }
        case TYPES.AUTHENTICATION_RESPONSE_CLEAR:
            return{
                ...state,
                status: {},
                errors: {}
            }
        case TYPES.AUTHENTICATION_STATE_CLEAR:
            return{
                ...state,
                [payload.key]: payload.value
            }

        default: 
            return state;
    }
}

export default authentication;