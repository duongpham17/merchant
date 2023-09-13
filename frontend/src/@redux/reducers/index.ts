import { combineReducers } from '@reduxjs/toolkit';

import alert from './alert';
import authentication from './authentication';
import users from './users';
import items from './items';
import osrs from './osrs';

const reducers = combineReducers({
    alert,
    authentication,
    users,
    items,
    osrs,

});

export default reducers;