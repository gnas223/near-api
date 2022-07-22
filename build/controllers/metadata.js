"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = __importDefault(require("../models/metadata"));
const upsertMetadata = (req, res, next) => {
    const formData = req.body;
    const metadata = JSON.parse(formData.data);
    metadata_1.default.findOneAndUpdate({}, { metadata }, { new: true, upsert: true })
        .then((metadata) => res.status(200).json(metadata))
        .catch(next);
};
const getUniqueMetadata = (req, res, next) => {
    metadata_1.default.find()
        .then((metadata) => res.status(200).json(metadata[0].metadata))
        .catch(next);
};
exports.default = { getUniqueMetadata, upsertMetadata };
//# sourceMappingURL=metadata.js.map