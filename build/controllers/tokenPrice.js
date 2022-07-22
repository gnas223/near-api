"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenPrice_1 = __importDefault(require("../models/TokenPrice"));
const getTokenPrice = (req, res, next) => {
    TokenPrice_1.default.find()
        .exec()
        .then((price) => res.json(price[0].tokenPrice))
        .catch(next);
};
exports.default = { getTokenPrice };
//# sourceMappingURL=tokenPrice.js.map