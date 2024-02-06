"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controllers/authentication");
const router = express_1.default.Router();
router.get('/persist', authentication_1.protect, authentication_1.persist);
router.post('/email', authentication_1.login);
router.post('/authenticate', authentication_1.confirmWithCode);
router.get('/authenticate/:token', authentication_1.confirmWithEmail);
exports.default = router;
