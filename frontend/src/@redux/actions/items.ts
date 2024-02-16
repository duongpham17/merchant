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

const destroy = (id: string) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        await api.patch(`/items/destroy/${id}`);
        dispatch({
            type: TYPES.ITEMS_DESTROY,
            payload: id
        });
    } catch (error: any) {
        console.log("Please reload")
        console.log(error.response);
    }
};

const analysis = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`/items/analysis`);
        dispatch({
            type: TYPES.ITEMS_ANALYSIS,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
        console.log(error.response);
    }
};

const unique = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`/items/unique`);
        dispatch({
            type: TYPES.ITEMS_UNIQUE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
        console.log(error.response);
    }
};


const Orders = {
    find,
    create, 
    update,
    remove,
    destroy,
    analysis,
    unique
};

export default Orders;