"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSecureToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createSecureToken = (id) => {
    const secret = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES;
    const token = jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: `${expires}d` });
    const expireInNumber = Date.now() + (expires * 24 * 60 * 60 * 1000);
    const cookie = {
        token: `Bearer ${token}`,
        expires: expireInNumber,
    };
    return cookie;
};
exports.createSecureToken = createSecureToken;
