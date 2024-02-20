import { ACTIONS, TYPES, INITIALSTATE } from '@redux/types/favourites';

const initialState: INITIALSTATE = {
    favourites: null,
};

export const reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.FAVOURITE_FIND:
            return{
                ...state,
                favourites: payload
            };
        case TYPES.FAVOURITE_CREATE:
            return{
                ...state,
                favourites: state.favourites ? [payload.id, ...state.favourites] : [payload.id]
            }
        case TYPES.FAVOURITE_REMOVE:
            return{
                ...state,
                favourites: state.favourites ? state.favourites.filter(el => el !== payload.id) : []
            }
        default: 
            return state;
    }
}

export default reducer;