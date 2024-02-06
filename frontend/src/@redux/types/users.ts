/*TYPES**************************************************************************************************************/

export interface IUser {
    _id: string,
    email: string,
    role: "user" | "admin",
    createdAt: Date
};

/*STATE**************************************************************************************************************/

export interface ResponseType {
    [key: string]: string
};

export interface INITIALSTATE_USER {
    user: IUser | null,
    users: IUser[] | null,
    status: ResponseType,
    errors: ResponseType,
};

export type UserObjectKeys = keyof INITIALSTATE_USER

/*ACTION**************************************************************************************************************/

export enum TYPES {
    USER_LOGIN = "USER_LOGIN",
    USER_FIND = "USER_FIND",
    USER_UPDATE = "USER_UPDATE",
    USER_RESPONSE_STATUS = "RESPONSE_STATUS",
    USER_RESPONSE_ERROR  = "RESPONSE_ERROR",
    USER_RESPONSE_CLEAR  = "RESPONSE_CLEAR",
    USER_STATE_CLEAR     = "USER_STATE_CLEAR",
};
 
interface Login {
    type: TYPES.USER_LOGIN,
    payload: IUser
}

interface Find {
    type: TYPES.USER_FIND,
    payload: IUser[]
};

interface Update {
    type: TYPES.USER_UPDATE,
    payload: IUser
};

interface Response_Status {
    type: TYPES.USER_RESPONSE_STATUS,
    payload: ResponseType
};

interface Response_Error {
    type: TYPES.USER_RESPONSE_ERROR,
    payload: ResponseType
};

interface Response_Clear {
    type: TYPES.USER_RESPONSE_CLEAR
    payload?: string
};

interface State_Clear {
    type: TYPES.USER_STATE_CLEAR,
    payload: {
        key: UserObjectKeys,
        value: any
    }
};

export type ACTIONS = 
    Login | Find | Update | 
    Response_Error | Response_Status | Response_Clear | State_Clear