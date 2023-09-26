"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestGeItems = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const axios_1 = __importDefault(require("axios"));
// GET LATEST OSRS ITEMS
const getLatestGeItems = async () => {
    const url = "https://prices.runescape.wiki/api/v1/osrs/mapping";
    try {
        const response = await axios_1.default.get(url);
        const jsonData = JSON.stringify(response.data, null, 2); // Convert object to JSON string
        await promises_1.default.writeFile("osrs-ge-items.json", jsonData); // Write the JSON data to a file
    }
    catch (error) {
        console.error('Error:', error);
    }
};
exports.getLatestGeItems = getLatestGeItems;
