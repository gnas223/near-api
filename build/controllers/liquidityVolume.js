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
const liquidityVolume_1 = __importDefault(require("../models/liquidityVolume"));
const get5mLiquidityVolume = (req, res, next) => {
    const pool_id = req.params.pool_id;
    liquidityVolume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(72)
        .then((liquidity) => res.status(200).json(liquidity.reverse()))
        .catch(next);
};
const updateNewLiquidityVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const liquidityAmount = JSON.parse(formData.data);
    const amounts = liquidityAmount.liquidity;
    const pool_id = liquidityAmount.pool_id;
    const liquidityDollar = liquidityAmount.liquidity_dollar;
    let lastestLiquidityVolume = yield liquidityVolume_1.default.find({ pool_id }).sort({ createdAt: -1 }).limit(1);
    if (lastestLiquidityVolume.length > 0) {
        let token1Volume;
        let token2Volume;
        let tokenId1;
        let tokenId2;
        if (Object.keys(lastestLiquidityVolume[0].liquidity)[0] === Object.keys(amounts)[0]) {
            tokenId1 = Object.keys(amounts)[0];
            tokenId2 = Object.keys(amounts)[1];
            token1Volume = Number(Object.values(lastestLiquidityVolume[0].liquidity)[0]) + Number(Object.values(amounts)[0]);
            token2Volume = Number(Object.values(lastestLiquidityVolume[0].liquidity)[1]) + Number(Object.values(amounts)[1]);
        }
        else {
            tokenId1 = Object.keys(amounts)[1];
            tokenId2 = Object.keys(amounts)[0];
            token1Volume = Number(Object.values(lastestLiquidityVolume[0].liquidity)[0]) + Number(Object.values(amounts)[1]);
            token2Volume = Number(Object.values(lastestLiquidityVolume[0].liquidity)[1]) + Number(Object.values(amounts)[0]);
        }
        let liquidity_dollar = Number(lastestLiquidityVolume[0].liquidity_dollar) || 0 + Number(liquidityDollar);
        liquidityVolume_1.default.findOneAndUpdate({ pool_id }, { liquidity: { [tokenId1]: token1Volume.toString(), [tokenId2]: token2Volume.toString() }, liquidity_dollar }, { sort: { createdAt: -1 } })
            .then((liquidity) => res.status(200).json(liquidity))
            .catch(next);
    }
});
const get15mLiquidityVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _288Volume = yield liquidityVolume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(288);
    function groupArr(data, n) {
        let group = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i]);
        }
        return group;
    }
    const groupVolume = groupArr(_288Volume, 3);
    let pool15mLiquidityVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0);
        pool15mLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total4hVolume
        });
    }
    return res.status(200).json(pool15mLiquidityVolume.reverse());
});
const get30mLiquidityVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _240Volume = yield liquidityVolume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(240);
    function groupArr(data, n) {
        let group = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i]);
        }
        return group;
    }
    const groupVolume = groupArr(_240Volume, 6);
    let pool30mLiquidityVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0);
        pool30mLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total4hVolume
        });
    }
    return res.status(200).json(pool30mLiquidityVolume.reverse());
});
const get1hLiquidityVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _576Volume = yield liquidityVolume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(576);
    function groupArr(data, n) {
        let group = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i]);
        }
        return group;
    }
    const groupVolume = groupArr(_576Volume, 12);
    let pool1hLiquidityVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0);
        pool1hLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total4hVolume
        });
    }
    return res.status(200).json(pool1hLiquidityVolume.reverse());
});
const get4hLiquidityVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _2016Volume = yield liquidityVolume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(2016);
    function groupArr(data, n) {
        let group = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i]);
        }
        return group;
    }
    const groupVolume = groupArr(_2016Volume, 48);
    let pool4hLiquidityVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0);
        pool4hLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total4hVolume
        });
    }
    return res.status(200).json(pool4hLiquidityVolume.reverse());
});
const get1dayLiquidityVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _4032Volume = yield liquidityVolume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(4032);
    function groupArr(data, n) {
        let group = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i]);
        }
        return group;
    }
    const groupVolume = groupArr(_4032Volume, 288);
    let pool1dayLiquidityVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0);
        pool1dayLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total1dayVolume
        });
    }
    return res.status(200).json(pool1dayLiquidityVolume.reverse());
});
const get4daysLiquidityVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _17280Volume = yield liquidityVolume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(17280);
    function groupArr(data, n) {
        let group = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i]);
        }
        return group;
    }
    const groupVolume = groupArr(_17280Volume, 1152);
    let pool4daysLiquidityVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0);
        pool4daysLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total1dayVolume
        });
    }
    return res.status(200).json(pool4daysLiquidityVolume.reverse());
});
const get7daysLiquidityVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _30240Volume = yield liquidityVolume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(30240);
    function groupArr(data, n) {
        let group = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i]);
        }
        return group;
    }
    const groupVolume = groupArr(_30240Volume, 2016);
    let pool7daysLiquidityVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0);
        pool7daysLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total1dayVolume
        });
    }
    return res.status(200).json(pool7daysLiquidityVolume.reverse());
});
const deleteAll = (req, res, next) => {
    liquidityVolume_1.default.deleteMany({})
        .exec()
        .then(() => res.status(200).json("delete all"))
        .catch(next);
};
exports.default = {
    get5mLiquidityVolume,
    get15mLiquidityVolume,
    get30mLiquidityVolume,
    get1hLiquidityVolume,
    get4hLiquidityVolume,
    get1dayLiquidityVolume,
    get4daysLiquidityVolume,
    get7daysLiquidityVolume,
    updateNewLiquidityVolume,
    deleteAll
};
//# sourceMappingURL=liquidityVolume.js.map