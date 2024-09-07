import { NextFunction, Response } from 'express';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import User from '../models/users';

export const find = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const data = await User.find({user: req.user._id});

    if(!data) return next(new appError('cannot find any users', 401));

    res.status(201).json({
        status: "success",
        data
    });
});

export const update = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const user = await User.findByIdAndUpdate(req.body._id, {...req.body}, {new: true});

    if(!user) return next(new appError('cannot update user data', 401));

    res.status(201).json({
        status: "success",
        data: user
    });
});