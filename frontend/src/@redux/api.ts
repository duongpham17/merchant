import axios from 'axios';

const url = process.env.NODE_ENV === "production" ? process.env.REACT_APP_PRODUCTION_PORT_API : process.env.REACT_APP_DEVELOPMENT_PORT_API;

const storage = localStorage.getItem("user");

const user = storage ? JSON.parse(storage) : {};

export const api = axios.create({
    baseURL: `${url}/api`,
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `${user.token}`
    },
});