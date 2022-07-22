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
const _24hVolume_1 = __importDefault(require("../models/24hVolume"));
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
// [POST]
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
exports.default = { getVolume24h, getVolume7days, getAllVolume, post24hVolume };
//# sourceMappingURL=24hVolume.js.map