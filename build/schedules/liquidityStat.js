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
const Pool_1 = __importDefault(require("../models/Pool"));
const liquidityVolume_1 = __importDefault(require("../models/liquidityVolume"));
// schedule tasks
node_schedule_1.default.scheduleJob("*/5 * * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("liquidity has created new doc!");
        const now = new Date();
        const utcNow = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()} ${now.getUTCHours().toString().padStart(2, "0")}:${now
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}:00`;
        const pools = yield Pool_1.default.find();
        const getLatestPoolId = yield liquidityVolume_1.default.findOne({
            pool_id: pools[pools.length - 1].pool_id,
        });
        if ((getLatestPoolId === null || getLatestPoolId === void 0 ? void 0 : getLatestPoolId.datetime) !== utcNow) {
            for (const pool of pools) {
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
        }
    });
});
//# sourceMappingURL=liquidityStat.js.map