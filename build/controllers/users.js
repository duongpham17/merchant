"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.find = void 0;
const helper_1 = require("../@utils/helper");
const users_1 = __importDefault(require("../models/users"));
exports.find = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await users_1.default.find({ user: req.user._id });
    if (!data)
        return next(new helper_1.appError('cannot find any users', 401));
    res.status(201).json({
        status: "success",
        data
    });
});
exports.update = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const user = await users_1.default.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true });
    if (!user)
        return next(new helper_1.appError('cannot update user data', 401));
    res.status(201).json({
        status: "success",
        data: user
    });
});
