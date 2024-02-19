import { ACTIONS, TYPES, INITIALSTATE } from '@redux/types/items';

const initialState: INITIALSTATE = {
    items: null,
    unique: null,
    analysis: null,
};

export const reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.ITEMS_FIND:
            return{
                ...state,
                items: payload
            };
        case TYPES.ITEMS_CREATE:
            return{
                ...state,
                items: state.items ? [payload, ...state.items] : [payload],
            };
        case TYPES.ITEMS_UPDATE:
            return{
                ...state,
                items: state.items ? state.items.map(el => el._id === payload._id ? payload : el) : [payload]
            };
        case TYPES.ITEMS_REMOVE:
            return{
                ...state,
                items: state.items ? state.items.filter(el => el._id !== payload._id) : []
            };
        case TYPES.ITEMS_DESTROY:
            return {
                ...state,
                items: state.items ? state.items.filter(el => el.id.toString() !== payload) : [],
                unique: state.unique ? state.unique.filter(el => el.id.toString() !== payload) : [] 
            };
        case TYPES.ITEMS_ANALYSIS:
            return{
                ...state,
                analysis: payload
            };
        case TYPES.ITEMS_UNIQUE:
            return{
                ...state,
                unique: payload
            };
        default: 
            return state;
    }
}

export default reducer;