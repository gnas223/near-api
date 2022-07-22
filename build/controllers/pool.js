"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pool_1 = __importDefault(require("../models/Pool"));
const liquidityVolume_1 = __importDefault(require("../models/liquidityVolume"));
const getAllPools = (req, res, next) => {
    Pool_1.default.find()
        .exec()
        .then((pool) => res.status(200).json(pool))
        .catch(next);
};
const getPool = (req, res, next) => {
    let pool_id = req.params.pool_id;
    Pool_1.default.findOne({ pool_id: Number(pool_id) })
        .exec()
        .then((pool) => res.status(200).json(pool))
        .catch(next);
};
// [POST]
const postLatestPool = (req, res, next) => {
    const now = new Date();
    const checkUtcNow = `${now.getUTCMinutes().toString().padStart(2, "0")}`;
    const formData = req.body;
    const newPool = JSON.parse(formData.newPool);
    const latestPool = new Pool_1.default(newPool);
    latestPool
        .save()
        .then((pool) => __awaiter(void 0, void 0, void 0, function* () {
        if (Number(checkUtcNow) % 5 !== 0) {
            let minute = Number(checkUtcNow);
            while (minute % 5 !== 0) {
                minute++;
            }
            const utcNow = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()} ${now
                .getUTCHours()
                .toString()
                .padStart(2, "0")}:${minute.toString()}:00`;
            liquidityVolume_1.default.create({
                pool_id: pool.pool_id,
                liquidity: {
                    [pool.token_account_ids[0]]: "",
                    [pool.token_account_ids[1]]: "",
                },
                liquidity_dollar: "0",
                datetime: utcNow,
            });
        }
        console.log("success import data");
        return res.status(200).json(pool);
    }))
        .catch(next);
};
// [PUT]
const updatePool = (req, res, next) => {
    const { pool_id, totalShares, amounts } = req.params;
    const arr = amounts.split(",");
    Pool_1.default.findOneAndUpdate({ pool_id: Number(pool_id) }, { totalShares, amounts: arr })
        .exec()
        .then((pool) => res.status(200).json(pool))
        .catch(next);
};
exports.default = { getAllPools, getPool, postLatestPool, updatePool };
//# sourceMappingURL=pool.js.map