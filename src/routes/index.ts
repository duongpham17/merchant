import {Express} from 'express';

import authentication from './authentication';
import items from './items';
import users from './users';

const endpoints = (app: Express) => {
    app.use('/api/authentication', authentication);
    app.use('/api/items', items);
    app.use('/api/users', users);
}

export default endpoints