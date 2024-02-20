/*TYPES**************************************************************************************************************/
import { OSRS_GE_ITEM } from '@data/osrs-ge';

/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    favourites: number[] | null,
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    FAVOURITE_FIND   = "FAVOURITE_FIND",
    FAVOURITE_CREATE = "FAVOURITE_CREATE",
    FAVOURITE_REMOVE = "FAVOURITE_REMOVE"
};

interface FIND {
    type: TYPES.FAVOURITE_FIND,
    payload: number[]
}

interface CREATE {
    type: TYPES.FAVOURITE_CREATE,
    payload: OSRS_GE_ITEM
};

interface REMOVE {
    type: TYPES.FAVOURITE_REMOVE,
    payload: OSRS_GE_ITEM 
};

export type ACTIONS = FIND | CREATE | REMOVE