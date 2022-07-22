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
const node_schedule_1 = __importDefault(require("node-schedule"));
const TokenPrice_1 = __importDefault(require("../models/TokenPrice"));
const axios_1 = __importDefault(require("axios"));
const tokenSymbol_json_1 = __importDefault(require("../assets/json/tokenSymbol.json"));
const getNewTokenPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let usdPriceOfToken = {};
    const tokenSymbols = tokenSymbol_json_1.default;
    const tokenIds = Object.keys(tokenSymbols);
    for (let i in tokenIds) {
        const key = tokenIds[i];
        const apiSymbol = tokenSymbols[key];
        let tokenPrice = yield (0, axios_1.default)({
            method: 'GET',
            url: `https://api.coingecko.com/api/v3/simple/price?ids=${apiSymbol}&vs_currencies=usd`
        })
            .then((res) => res.data)
            .catch(err => "0");
        if (!tokenPrice || Object.keys(tokenPrice).length === 0)
            tokenPrice = { [apiSymbol]: 0 };
        usdPriceOfToken[key] = ((_b = (_a = Object.values(tokenPrice)[0]) === null || _a === void 0 ? void 0 : _a.usd) === null || _b === void 0 ? void 0 : _b.toLocaleString('fullwide', { useGrouping: false })) || '0';
    }
    // console.log(usdPriceOfToken);
    return usdPriceOfToken;
});
node_schedule_1.default.scheduleJob('*/5 * * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Token price has update new price");
        const tokenPrice = yield getNewTokenPrice();
        yield TokenPrice_1.default.findOneAndUpdate({}, { tokenPrice }, {
            new: true,
            upsert: true
        });
    });
});
//# sourceMappingURL=updateTokenPrice.js.map