/*TYPES**************************************************************************************************************/

export interface OSRS_GE {
    high: number,
    highTime: number,
    low: number,
    lowTime: number
};
/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    latest: OSRS_GE[] | [],
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    OSRS_GE_LATEST = "OSRS_GE_LATEST",
}

interface LATEST {
    type: TYPES.OSRS_GE_LATEST,
    payload: OSRS_GE[]
};

export type ACTIONS = LATEST