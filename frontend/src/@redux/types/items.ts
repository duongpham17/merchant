/*TYPES**************************************************************************************************************/

export interface IItems {
    _id: string,
    id: number,
    name: string,
    side: "buy" | "sell" | string,
    quantity: number,
    price: number,
    icon: string,
    timestamp: Number
};

export type UniqueItem = {id: number, icon: string};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    items: IItems[] | null,
    unique: UniqueItem[] | null,
    analysis: IItems[] | null
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    ITEMS_FIND     = "ITEMS_FIND",
    ITEMS_CREATE   = "ITEMS_CREATE",
    ITEMS_UPDATE   = "ITEMS_UPDATE",
    ITEMS_REMOVE   = "ITEMS_REMOVE",
    ITEMS_DESTROY  = "ITEMS_DESTROY",
    ITEMS_ANALYSIS = "ITEMS_ANALYSIS",
    ITEMS_UNIQUE   = "ITEMS_UNIQUE"
};

interface FIND {
    type: TYPES.ITEMS_FIND,
    payload: IItems[]
};

interface CREATE {
    type: TYPES.ITEMS_CREATE,
    payload: IItems
};

interface UPDATE {
    type: TYPES.ITEMS_UPDATE,
    payload: IItems
};

interface REMOVE {
    type: TYPES.ITEMS_REMOVE,
    payload: IItems
};

interface ANALYSIS {
    type: TYPES.ITEMS_ANALYSIS,
    payload: IItems[]
};

interface UNIQUE {
    type: TYPES.ITEMS_UNIQUE,
    payload: UniqueItem[]
};

interface DESTROY {
    type: TYPES.ITEMS_DESTROY,
    payload: string // id of item
};

export type ACTIONS = FIND | CREATE | UPDATE | REMOVE | DESTROY | UNIQUE | ANALYSIS