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
const volume_1 = __importDefault(require("../models/volume"));
// get 5 minutes for each 
const get5mVolume = (req, res, next) => {
    const pool_id = req.params.pool_id;
    volume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(96)
        .then((volume) => res.status(200).json(volume.reverse()))
        .catch(next);
};
const updateNewVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    const _24hvolume = JSON.parse(formData.data);
    const amounts = _24hvolume.volume;
    const pool_id = _24hvolume.pool_id;
    const volumeDollar = _24hvolume.volume_dollar;
    let latestVolume = yield volume_1.default.find({ pool_id }).sort({ createdAt: -1 }).limit(1);
    console.log(latestVolume);
    if (latestVolume.length > 0) {
        let token1Volume;
        let token2Volume;
        let tokenId1;
        let tokenId2;
        if (Object.keys(latestVolume[0].volume)[0] === Object.keys(amounts)[0]) {
            tokenId1 = Object.keys(amounts)[0];
            tokenId2 = Object.keys(amounts)[1];
            token1Volume = Number(Object.values(latestVolume[0].volume)[0]) + Number(Object.values(amounts)[0]);
            token2Volume = Number(Object.values(latestVolume[0].volume)[1]) + Number(Object.values(amounts)[1]);
        }
        else {
            tokenId1 = Object.keys(amounts)[1];
            tokenId2 = Object.keys(amounts)[0];
            token1Volume = Number(Object.values(latestVolume[0].volume)[0]) + Number(Object.values(amounts)[1]);
            token2Volume = Number(Object.values(latestVolume[0].volume)[1]) + Number(Object.values(amounts)[0]);
        }
        let volume_dollar = Number(latestVolume[0].volume_dollar) + Number(volumeDollar);
        volume_1.default.findOneAndUpdate({ pool_id }, { volume: { [tokenId1]: token1Volume.toString(), [tokenId2]: token2Volume.toString() }, volume_dollar }, { sort: { createdAt: -1 } })
            .then((volume) => res.status(200).json(volume))
            .catch(next);
    }
});
// get 15 minutes for each
const get15mVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _288Volume = yield volume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(288);
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
    let pool15mVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.volume_dollar), 0);
        pool15mVolume.push({
            datetime: firstDatetime,
            volume_dollar: total4hVolume
        });
    }
    return res.status(200).json(pool15mVolume.reverse());
});
const get30mVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _240Volume = yield volume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(240);
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
    let pool30mVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.volume_dollar), 0);
        pool30mVolume.push({
            datetime: firstDatetime,
            volume_dollar: total4hVolume
        });
    }
    return res.status(200).json(pool30mVolume.reverse());
});
const get1hVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _576Volume = yield volume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(576);
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
    let pool1hVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.volume_dollar), 0);
        pool1hVolume.push({
            datetime: firstDatetime,
            volume_dollar: total4hVolume
        });
    }
    return res.status(200).json(pool1hVolume.reverse());
});
const get4hVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _2016Volume = yield volume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(2016);
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
    let pool4hVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.volume_dollar), 0);
        pool4hVolume.push({
            datetime: firstDatetime,
            volume_dollar: total4hVolume
        });
    }
    return res.status(200).json(pool4hVolume.reverse());
});
const get1dayVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _4032Volume = yield volume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(4032);
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
    let pool1dayVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.volume_dollar), 0);
        pool1dayVolume.push({
            datetime: firstDatetime,
            volume_dollar: total1dayVolume
        });
    }
    return res.status(200).json(pool1dayVolume.reverse());
});
const get4daysVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _17280Volume = yield volume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(17280);
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
    let pool4daysVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.volume_dollar), 0);
        pool4daysVolume.push({
            datetime: firstDatetime,
            volume_dollar: total1dayVolume
        });
    }
    return res.status(200).json(pool4daysVolume.reverse());
});
const get7daysVolume = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool_id = req.params.pool_id;
    const _30240Volume = yield volume_1.default.find({ pool_id: Number(pool_id) }).sort({ createdAt: -1 }).limit(30240);
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
    let pool7daysVolume = [];
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime;
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.volume_dollar), 0);
        pool7daysVolume.push({
            datetime: firstDatetime,
            volume_dollar: total1dayVolume
        });
    }
    return res.status(200).json(pool7daysVolume.reverse());
});
const deleteAll = (req, res, next) => {
    volume_1.default.deleteMany({})
        .exec()
        .then(() => res.status(200).json("delete all"))
        .catch(next);
};
exports.default = {
    get5mVolume,
    get15mVolume,
    get30mVolume,
    get1hVolume,
    get4hVolume,
    get1dayVolume,
    get4daysVolume,
    get7daysVolume,
    updateNewVolume,
    deleteAll
};
//# sourceMappingURL=volume.js.map