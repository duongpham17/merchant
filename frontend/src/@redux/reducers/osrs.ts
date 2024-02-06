import { ACTIONS, TYPES, INITIALSTATE } from '@redux/types/osrs';

const initialState: INITIALSTATE = {
    latest: [],
    timeseries: [],
};

export const reducer = (state = initialState, action: ACTIONS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES.OSRS_GE_LATEST:
            return{
                ...state,
                latest: payload
            };
        case TYPES.OSRS_GE_TIMESERIES:
            return{
                ...state,
                timeseries: (() => {
                    const updated_timeseries = [];
                    for(let x of payload){
                        if(x.avgHighPrice && x.avgLowPrice) updated_timeseries.push({...x})
                    };
                    return updated_timeseries
                })()
            }
        default: 
            return state;
    }
}

export default reducer;