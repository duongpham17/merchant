"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFields = exports.updateAll = exports.newFields = void 0;
const items_1 = __importDefault(require("../models/items"));
const newFields = async () => {
    try {
        // Update documents that do not have 'buy' and 'sell' fields
        await items_1.default.updateMany({ sell: { $exists: false }, buy: { $exists: false } }, { $set: { buy: 0, sell: 0 } } // Set default values for buy and sell
        );
        console.log("done");
    }
    catch (error) {
        console.error("Error:", error);
    }
};
exports.newFields = newFields;
const updateAll = async () => {
    const items = await items_1.default.find();
    for (let x of items) {
        await items_1.default.findByIdAndUpdate(x._id, x, { new: true });
        console.log(x._id, "updated");
    }
    ;
    console.log("done");
};
exports.updateAll = updateAll;
const deleteFields = async () => {
    try {
        await items_1.default.updateMany({}, // Empty filter object to match all documents
        { $unset: { price: 1, sold: 1 } });
        console.log(`Fields deleted`);
    }
    catch (error) {
        console.error("Error:", error);
    }
};
exports.deleteFields = deleteFields;
