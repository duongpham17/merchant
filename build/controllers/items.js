"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = exports.analysis = exports.destroy = exports.remove = exports.update = exports.create = exports.find = void 0;
const helper_1 = require("../@utils/helper");
const items_1 = __importDefault(require("../models/items"));
exports.find = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({ [el.split("=")[0]]: el.split("=")[1] })));
    const items = await items_1.default.find({ ...filter, user: req.user._id }).sort({ timestamp: -1 });
    if (!items)
        return next(new helper_1.appError('cannot find any items', 401));
    res.status(200).json({
        status: "success",
        data: items
    });
});
exports.create = (0, helper_1.asyncBlock)(async (req, res, next) => {
    req.body.user = req.user._id;
    const items = await items_1.default.create({ ...req.body, timestamp: Date.now() });
    if (!items)
        return next(new helper_1.appError('cannot create items', 401));
    res.status(200).json({
        status: "success",
        data: items
    });
});
exports.update = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const items = await items_1.default.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!items)
        return next(new helper_1.appError('cannot update items data', 401));
    res.status(200).json({
        status: "success",
        data: items
    });
});
exports.remove = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const item = await items_1.default.findByIdAndDelete(req.params.id);
    if (!item)
        return next(new helper_1.appError('cannot delete item data', 401));
    res.status(200).json({
        status: "success",
        data: item
    });
});
exports.destroy = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const items = await items_1.default.find({ id: req.params.id, user: req.user._id });
    if (!items || items.length === 0) {
        return next(new helper_1.appError('Cannot find items to delete', 404));
    }
    const itemIds = items.map(item => item._id);
    // Use deleteMany to delete all items matching the given criteria
    const deleteResult = await items_1.default.deleteMany({ _id: { $in: itemIds } });
    if (deleteResult.deletedCount === 0)
        return next(new helper_1.appError('No items were deleted', 404));
    res.status(200).json({
        status: "success",
    });
});
exports.analysis = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const items = await items_1.default.find({ user: req.user._id }).sort({ timestamp: -1 });
    if (!items)
        return next(new helper_1.appError('cannot find any items', 401));
    res.status(200).json({
        status: "success",
        data: items
    });
});
exports.unique = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const items = await items_1.default.aggregate([
        {
            $match: { user: req.user._id }
        },
        {
            $group: {
                _id: "$id",
                icon: { $first: "$icon" } // Assuming "icon" is a field in your documents
            }
        },
        {
            $project: {
                _id: 0,
                id: "$_id",
                icon: 1
            }
        }
    ]);
    if (!items)
        return next(new helper_1.appError('cannot find any items', 401));
    res.status(200).json({
        status: "success",
        data: items
    });
});
