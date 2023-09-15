/*TYPES**************************************************************************************************************/

export interface OSRS_GE_LATEST {
    high: number,
    highTime: number,
    low: number,
    lowTime: number
};

export interface OSRS_GE_TIMESERIES {
    timestamp: number,
    avgHighPrice: number,
    avgLowPrice: number,
    highPriceVolume: number,
    lowPriceVolume: number
};
/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    latest: OSRS_GE_LATEST[] | [],
    timeseries: OSRS_GE_TIMESERIES[] | []
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    OSRS_GE_LATEST     = "OSRS_GE_LATEST",
    OSRS_GE_TIMESERIES = "OSRS_GE_TIMESERIES"
};

interface LATEST {
    type: TYPES.OSRS_GE_LATEST,
    payload: OSRS_GE_LATEST[]
};

interface TIMESERIES {
    type: TYPES.OSRS_GE_TIMESERIES,
    payload: OSRS_GE_TIMESERIES[]
};


export type ACTIONS = LATEST | TIMESERIES