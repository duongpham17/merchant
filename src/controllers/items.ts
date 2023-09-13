import { NextFunction, Response } from 'express';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import Items from '../models/items';

export const find = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({[el.split("=")[0]]: el.split("=")[1]})))
    
    const items = await Items.find({...filter, user: req.user._id}).sort({timestamp: -1});

    if(!items) return next(new appError('cannot find any items', 401));

    res.status(200).json({
        status: "success",
        data: items
    });
});

export const create = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {

    req.body.user = req.user._id;

    const items = await Items.create({...req.body, timestamp: Date.now()});

    if(!items) return next(new appError('cannot create items', 401));

    res.status(200).json({
        status: "success",
        data: items
    });
});

export const update = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const items = await Items.findByIdAndUpdate(req.body._id, req.body, {new: true});

    if(!items) return next(new appError('cannot update items data', 401));

    res.status(200).json({
        status: "success",
        data: items
    });
});

export const remove = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const items = await Items.findByIdAndDelete(req.params.id);

    if(!items) return next(new appError('cannot delete items data', 401));

    res.status(200).json({
        status: "success",
        data: items
    });
});
