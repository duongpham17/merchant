import { api } from '@redux/api';
import { Dispatch } from 'redux';
import { ACTIONS, TYPES, IUser, UserObjectKeys } from '@redux/types/users';

const find = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`/users`);
        dispatch({
            type: TYPES.USER_FIND,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const update = (data: IUser) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.patch(`/users`, data);
        dispatch({
            type: TYPES.USER_UPDATE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const state_clear = (key:UserObjectKeys, value: any) => async (dispatch: Dispatch<ACTIONS>) => {
    dispatch({
        type: TYPES.USER_STATE_CLEAR,
        payload: { key, value }
    });
};

const User = {
    update,
    find,
    state_clear
};

export default User;