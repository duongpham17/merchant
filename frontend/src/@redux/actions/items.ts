import { Dispatch } from 'redux';
import { ACTIONS, TYPES, IItems } from '@redux/types/items';
import { api } from '@redux/api';

const find = (filter: string) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`/items/${filter}`);
        dispatch({
            type: TYPES.ITEMS_FIND,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
        console.log(error);
    }
};

const create = (data: Partial<IItems>) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.post(`/items`, data);
        dispatch({
            type: TYPES.ITEMS_CREATE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const update = (data: IItems) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.patch(`/items`, data);
        dispatch({
            type: TYPES.ITEMS_UPDATE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const remove = (id: string) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.delete(`/items/${id}`);
        dispatch({
            type: TYPES.ITEMS_REMOVE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const Orders = {
    find,
    create, 
    update,
    remove,
};

export default Orders;