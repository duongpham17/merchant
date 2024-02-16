import { NextFunction, Response } from 'express';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import Items from '../models/items';

export const find = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({[el.split("=")[0]]: el.split("=")[1]})));
    
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

    const item = await Items.findByIdAndDelete(req.params.id);

    if(!item) return next(new appError('cannot delete item data', 401));

    res.status(200).json({
        status: "success",
        data: item
    });
});

export const destroy = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const items = await Items.find({id: req.params.id, user: req.user._id});

    if(!items || items.length === 0) {
        return next(new appError('Cannot find items to delete', 404));
    }

    const itemIds = items.map(item => item._id);

    // Use deleteMany to delete all items matching the given criteria
    const deleteResult = await Items.deleteMany({ _id: { $in: itemIds } });

    if (deleteResult.deletedCount === 0) return next(new appError('No items were deleted', 404));

    res.status(200).json({
        status: "success",
    });
});

export const analysis = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const items = await Items.find({user: req.user._id}).sort({timestamp: -1});

    if(!items) return next(new appError('cannot find any items', 401));

    res.status(200).json({
        status: "success",
        data: items
    });
});

export const unique = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const items = await Items.find({user: req.user._id}).sort({timestamp: -1});

    if(!items) return next(new appError('cannot find any items', 401));

    const unique_item: { id: number; icon: string }[] = [];

    for (const x of items) {
      const exist = unique_item.some((item) => item.id === x.id && item.icon === x.icon);
      if (exist) continue;
      unique_item.push({ id: x.id, icon: x.icon });
    };

    res.status(200).json({
        status: "success",
        data: unique_item
    });
});