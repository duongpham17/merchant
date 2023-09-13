/*TYPES**************************************************************************************************************/

export interface IItems {
    _id: string,
    id: number,
    name: string,
    side: "buy" | "sell" | string,
    quantity: number,
    price: number,
    sold: number,
    cost_basis: number,
    new_total_quantity: number,
    timestamp: Number
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    items: IItems[] | null,
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    ITEMS_FIND   = "ITEMS_FIND",
    ITEMS_CREATE = "ITEMS_CREATE",
    ITEMS_UPDATE = "ITEMS_UPDATE",
    ITEMS_REMOVE = "ITEMS_REMOVE",
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

export type ACTIONS = FIND | CREATE | UPDATE | REMOVE