import { Dispatch } from 'redux';
import { OSRS_GE_ITEM } from '@data/osrs-ge';
import { ACTIONS, TYPES } from '@redux/types/favourites';

const find = () => (dispatch: Dispatch<ACTIONS>) => {
    const savedDataString = localStorage.getItem("ge-item-favourite");
    const favourite: number[] = savedDataString ? JSON.parse(savedDataString) : null;
    dispatch({
        type: TYPES.FAVOURITE_FIND,
        payload: favourite
    });
};

const selector = (item: OSRS_GE_ITEM, favourites: number[]) =>  (dispatch: Dispatch<ACTIONS>) => {
    const isAlreadySaved = favourites.includes(item.id);
    if(isAlreadySaved){
        const newData = favourites.filter(el => el !== item.id);
        localStorage.setItem("ge-item-favourite", JSON.stringify(newData));
        dispatch({
            type: TYPES.FAVOURITE_REMOVE,
            payload: item
        });
    } else {
        const newData = [item.id, ...favourites];
        localStorage.setItem("ge-item-favourite", JSON.stringify(newData));
        dispatch({
            type: TYPES.FAVOURITE_CREATE,
            payload: item
        });
    }
}

const create = (item: OSRS_GE_ITEM) => (dispatch: Dispatch<ACTIONS>) => {
    const savedDataString = localStorage.getItem("ge-item-favourite");
    const favourite: number[] = savedDataString ? JSON.parse(savedDataString) : null;

    if(favourite){
        const newData = [item.id, ...favourite];
        localStorage.setItem("ge-item-favourite", JSON.stringify(newData));
    } else {
        localStorage.setItem("ge-item-favourite", JSON.stringify([item.id]));
    }

    dispatch({
        type: TYPES.FAVOURITE_CREATE,
        payload: item
    });

};

const remove = (item: OSRS_GE_ITEM) => (dispatch: Dispatch<ACTIONS>) => {
    const savedDataString = localStorage.getItem("ge-item-favourite");
    const favourite: number[] = savedDataString ? JSON.parse(savedDataString) : null;

    if(favourite){
        const newData = favourite.filter(el => el !== item.id);
        localStorage.setItem("ge-item-favourite", JSON.stringify(newData));
    } else {
        localStorage.setItem("ge-item-favourite", JSON.stringify([]));
    }
    
    dispatch({
        type: TYPES.FAVOURITE_REMOVE,
        payload: item
    });

};

const Favourite = {
    find,
    create,
    remove,
    selector,
};

export default Favourite;