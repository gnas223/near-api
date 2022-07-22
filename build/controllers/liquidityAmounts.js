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
const liquidityAmounts_1 = __importDefault(require("../models/liquidityAmounts"));
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
exports.default = { getLiquidityIn24h, getAllLiquidityVolume, postLiquidityAmounts };
//# sourceMappingURL=liquidityAmounts.js.map