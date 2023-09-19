"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const itemsSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: {
        type: String
    },
    id: {
        type: Number
    },
    side: {
        type: String,
        enum: ["buy", "sell"],
        default: "buy"
    },
    buy: {
        type: Number,
    },
    sell: {
        type: Number
    },
    quantity: {
        type: Number
    },
    icon: {
        type: String,
        default: ""
    },
    timestamp: {
        type: Number,
        default: Date.now()
    }
});
exports.default = (0, mongoose_1.model)('Items', itemsSchema);
