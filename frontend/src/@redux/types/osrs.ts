/*TYPES**************************************************************************************************************/

export interface OSRS_GE_LATEST {
    high: number,
    highTime: number,
    low: number,
    lowTime: number
};
/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    latest: OSRS_GE_LATEST[] | [],
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    OSRS_GE_LATEST = "OSRS_GE_LATEST",
}

interface LATEST {
    type: TYPES.OSRS_GE_LATEST,
    payload: OSRS_GE_LATEST[]
};

export type ACTIONS = LATEST