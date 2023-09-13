/*TYPES**************************************************************************************************************/
export interface ResponseType {
    [key: string]: any
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE_AUTHENTICATION {
    isLoggedIn: boolean,
    status: ResponseType,
    errors: ResponseType,
};

export type AuthenticationObjectKeys = keyof INITIALSTATE_AUTHENTICATION

/*ACTION**************************************************************************************************************/

export enum TYPES {
    AUTHENTICATION_LOAD_USER        = "AUTHENTICATION_LOAD_USER",
    
    AUTHENTICATION_RESPONSE_ERROR   = "AUTHENTICATION_RESPONSE_ERROR",
    AUTHENTICATION_RESPONSE_STATUS  = "AUTHENTICATION_RESPONSE_STATUS",
    AUTHENTICATION_RESPONSE_CLEAR   = "AUTHENTICATION_RESPONSE_CLEAR",
    AUTHENTICATION_STATE_CLEAR      = "AUTHENTICATION_STATE_CLEAR",
};

interface LoadUser {
    type: TYPES.AUTHENTICATION_LOAD_USER,
    payload: boolean
};

interface Response_Status {
    type: TYPES.AUTHENTICATION_RESPONSE_STATUS,
    payload: ResponseType
};

interface Response_Error {
    type: TYPES.AUTHENTICATION_RESPONSE_ERROR,
    payload: ResponseType
};

interface Response_Clear {
    type: TYPES.AUTHENTICATION_RESPONSE_CLEAR
    payload?: string
};

interface State_Clear {
    type: TYPES.AUTHENTICATION_STATE_CLEAR,
    payload: {
        key: AuthenticationObjectKeys,
        value: any
    }
};

export type ACTIONS = LoadUser | Response_Status | Response_Clear | Response_Error | State_Clear