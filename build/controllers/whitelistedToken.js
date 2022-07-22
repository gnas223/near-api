"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WhitelistedToken_1 = __importDefault(require("../models/WhitelistedToken"));
const getWhiteListToken = (req, res, next) => {
    WhitelistedToken_1.default.find()
        .exec()
        .then((token) => res.status(200).json(token))
        .catch(next);
};
exports.default = { getWhiteListToken };
//# sourceMappingURL=whitelistedToken.js.map