"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.many = exports.remove = exports.update = exports.create = exports.find = void 0;
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
    const items = await items_1.default.findByIdAndDelete(req.params.id);
    if (!items)
        return next(new helper_1.appError('cannot delete items data', 401));
    res.status(200).json({
        status: "success",
        data: items
    });
});
exports.many = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const filter = Object.assign({}, ...req.params.filter.split(",").map(el => ({ [el.split("=")[0]]: el.split("=")[1] })));
    const items = await items_1.default.find({ ...filter, user: req.user._id });
    if (!items)
        return next(new helper_1.appError('cannot delete items data', 401));
    for (let x of items) {
        await items_1.default.findByIdAndDelete(x._id);
        console.log("delete", x._id);
    }
    ;
    res.status(200).json({
        status: "success",
        data: items
    });
});
