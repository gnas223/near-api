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
const WhitelistedToken_1 = __importDefault(require("../models/WhitelistedToken"));
const TokenPrice_1 = __importDefault(require("../models/TokenPrice"));
const _24hVolume_1 = __importDefault(require("../models/24hVolume"));
const liquidityAmounts_1 = __importDefault(require("../models/liquidityAmounts"));
// [GET]
const test = (req, res, next) => {
    res.json('API forbitSpace near');
};
const getAllPools = (req, res, next) => {
    Pool_1.default.find()
        .exec()
        .then((pool) => res.status(200).json(pool))
        .catch(next);
};
const getWhiteListToken = (req, res, next) => {
    WhitelistedToken_1.default.find()
        .exec()
        .then((token) => res.status(200).json(token))
        .catch(next);
};
const getPool = (req, res, next) => {
    let pool_id = req.params.pool_id;
    Pool_1.default.findOne({ pool_id: Number(pool_id) })
        .exec()
        .then((pool) => res.status(200).json(pool))
        .catch(next);
};
const getTokenPrice = (req, res, next) => {
    TokenPrice_1.default.find()
        .exec()
        .then((price) => res.json(price))
        .catch(next);
};
const getVolume24h = (req, res, next) => {
    const pool_id = req.params.pool_id;
    const date = req.params.date;
    _24hVolume_1.default.findOne({ pool_id: Number(pool_id), date: date })
        .exec()
        .then((pool) => res.status(200).json(pool))
        .catch(next);
};
const getVolume7days = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const today = new Date();
    const days = 7;
    const last = new Date(today.getTime() - (days * 24 * 60 * 60 * 1000));
    const poolVolume = yield _24hVolume_1.default.find({ pool_id: Number(pool_id) });
    const volume7days = poolVolume.slice(poolVolume.length - days);
    const unixTimeOf7daysAgo = new Date(last).getTime();
    let result = [];
    for (let volume of volume7days) {
        const unixTimeOfVolumeIn7days = new Date(volume.date).getTime();
        if (unixTimeOfVolumeIn7days > unixTimeOf7daysAgo) {
            result.push(volume);
        }
        else {
            continue;
        }
    }
    return result.length > 0 ? res.status(200).json(result) : res.status(200).json([]);
});
const getAllVolume = (req, res, next) => {
    const pool_id = req.params.pool_id;
    _24hVolume_1.default.find({ pool_id: Number(pool_id) })
        .exec()
        .then((volume) => res.status(200).json(volume))
        .catch(next);
};
const getLiquidityIn24h = (req, res, next) => {
    const pool_id = req.params.pool_id;
    const date = req.params.date;
    liquidityAmounts_1.default.findOne({ pool_id: Number(pool_id), date })
        .exec()
        .then((liquidity) => res.status(200).json(liquidity))
        .catch(next);
};
const getAllLiquidityVolume = (req, res, next) => {
    const pool_id = req.params.pool_id;
    liquidityAmounts_1.default.find({ pool_id: Number(pool_id) })
        .exec()
        .then((liquidity) => res.status(200).json(liquidity))
        .catch(next);
};
//[POST]
const postLastestPool = (req, res, next) => {
    const formData = req.body;
    const newPool = JSON.parse(formData.newPool);
    const lastestPool = new Pool_1.default(newPool);
    lastestPool.save()
        .then((pool) => res.status(200).json(pool))
        .catch(next);
};
const post24hVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const volume24h = JSON.parse(formData.volume);
    const amounts = volume24h.volume;
    const dateReq = volume24h.date;
    const pool_id = volume24h.pool_id;
    const volumeDollar = volume24h.volume_dollar;
    let volumeInToday = yield _24hVolume_1.default.find({ date: dateReq });
    const poolInToday = volumeInToday.filter(pool => pool.date === dateReq && pool.pool_id === pool_id);
    if (poolInToday.length > 0) {
        let token1Volume;
        let token2Volume;
        let tokenId1;
        let tokenId2;
        if (Object.keys(poolInToday[0].volume)[0] === Object.keys(amounts)[0]) {
            tokenId1 = Object.keys(amounts)[0];
            tokenId2 = Object.keys(amounts)[1];
            token1Volume = Number(Object.values(poolInToday[0].volume)[0]) + Number(Object.values(amounts)[0]);
            token2Volume = Number(Object.values(poolInToday[0].volume)[1]) + Number(Object.values(amounts)[1]);
        }
        else {
            tokenId1 = Object.keys(amounts)[1];
            tokenId2 = Object.keys(amounts)[0];
            token1Volume = Number(Object.values(poolInToday[0].volume)[0]) + Number(Object.values(amounts)[1]);
            token2Volume = Number(Object.values(poolInToday[0].volume)[1]) + Number(Object.values(amounts)[0]);
        }
        let volume_dollar = Number(poolInToday[0].volume_dollar) + Number(volumeDollar);
        _24hVolume_1.default.updateOne({ pool_id, date: dateReq }, { volume: { [tokenId1]: token1Volume.toString(), [tokenId2]: token2Volume.toString() }, volume_dollar })
            .then((volume) => res.status(200).json(volume))
            .catch(next);
    }
    else {
        const volumeIn24h = new _24hVolume_1.default(volume24h);
        volumeIn24h.save()
            .then((volume) => res.status(200).json(volume))
            .catch(next);
    }
});
const postLiquidityAmounts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const liquidity24h = JSON.parse(formData.liquidityAmounts);
    console.log(liquidity24h);
    const amounts = liquidity24h.liquidity;
    const dateReq = liquidity24h.date;
    const pool_id = liquidity24h.pool_id;
    const liquidityDollar = liquidity24h.liquidity_dollar;
    let liquidityInToday = yield liquidityAmounts_1.default.find({ date: dateReq });
    const poolInToday = liquidityInToday.filter(pool => pool.date === dateReq && pool.pool_id === pool_id);
    if (poolInToday.length > 0) {
        let token1Volume;
        let token2Volume;
        let tokenId1;
        let tokenId2;
        if (Object.keys(poolInToday[0].liquidity)[0] === Object.keys(amounts)[0]) {
            tokenId1 = Object.keys(amounts)[0];
            tokenId2 = Object.keys(amounts)[1];
            token1Volume = Number(Object.values(poolInToday[0].liquidity)[0]) + Number(Object.values(amounts)[0]);
            token2Volume = Number(Object.values(poolInToday[0].liquidity)[1]) + Number(Object.values(amounts)[1]);
        }
        else {
            tokenId1 = Object.keys(amounts)[1];
            tokenId2 = Object.keys(amounts)[0];
            token1Volume = Number(Object.values(poolInToday[0].liquidity)[0]) + Number(Object.values(amounts)[1]);
            token2Volume = Number(Object.values(poolInToday[0].liquidity)[1]) + Number(Object.values(amounts)[0]);
        }
        let liquidity_dollar = Number(poolInToday[0].liquidity_dollar) + Number(liquidityDollar);
        liquidityAmounts_1.default.updateOne({ pool_id, date: dateReq }, { liquidity: { [tokenId1]: token1Volume.toString(), [tokenId2]: token2Volume.toString() }, liquidity_dollar: liquidity_dollar.toString() })
            .then((volume) => res.status(200).json(volume))
            .catch(next);
    }
    else {
        const _liquidity24h = new liquidityAmounts_1.default(liquidity24h);
        _liquidity24h.save()
            .then((liquidity) => res.status(200).json(liquidity))
            .catch(next);
    }
});
// [PUT]
const updatePool = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pool_id, totalShares, amounts } = req.params;
    const arr = amounts.split(",");
    let doc = yield Pool_1.default.findOne({ pool_id });
    yield Pool_1.default.updateOne({ pool_id }, { totalShares, amounts: arr });
    yield (doc === null || doc === void 0 ? void 0 : doc.save());
    const newPool = yield Pool_1.default.findOne({ pool_id });
    return res.status(200).json(newPool);
});
const updateNewPrice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const newPrice = JSON.parse(formData.newPrice);
    TokenPrice_1.default.updateOne({}, { tokenPrice: newPrice })
        .then((price) => res.json(price))
        .catch(next);
});
exports.default = { test, getAllPools, getWhiteListToken, getPool, getTokenPrice, getVolume24h, getVolume7days, getAllVolume, getLiquidityIn24h, getAllLiquidityVolume, postLastestPool, post24hVolume, postLiquidityAmounts, updateNewPrice, updatePool };
//# sourceMappingURL=TokenController.js.map