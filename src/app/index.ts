import express from 'express';
import frontend from './frontend';
import database from './database';
import parser from './parser';
import port from './port';
import routes from './routes';
import security from './security';
//import osrs from './osrs';

const app = express();

export default (): void => {

    security(app);

    parser(app, express);

    routes(app);

    database();

    frontend(app, express);

    port(app);
    
};