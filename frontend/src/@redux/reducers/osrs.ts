import { ACTIONS, TYPES, INITIALSTATE } from '@redux/types/osrs';

const initialState: INITIALSTATE = {
    latest: [],
};

export const reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.OSRS_GE_LATEST:
            return{
                ...state,
                latest: payload
            };
        default: 
            return state;
    }
}

export default reducer;