"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controllers/authentication");
const items_1 = require("../controllers/items");
const router = express_1.default.Router();
router.use(authentication_1.protect);
router.get("/:filter", items_1.find);
router.post("/", items_1.create);
router.patch("/", items_1.update);
router.delete("/:id", items_1.remove);
exports.default = router;
