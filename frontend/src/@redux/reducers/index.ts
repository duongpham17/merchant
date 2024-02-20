import { combineReducers } from '@reduxjs/toolkit';

import alert from './alert';
import authentication from './authentication';
import users from './users';
import items from './items';
import osrs from './osrs';
import favourites from './favourites';

const reducers = combineReducers({
    alert,
    authentication,
    users,
    items,
    osrs,
    favourites
});

export default reducers;