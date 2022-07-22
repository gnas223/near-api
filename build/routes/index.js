"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const pool_1 = __importDefault(require("../controllers/pool"));
const tokenPrice_1 = __importDefault(require("../controllers/tokenPrice"));
const whitelistedToken_1 = __importDefault(require("../controllers/whitelistedToken"));
const swapVolume_1 = __importDefault(require("../controllers/swapVolume"));
const liquidityVolume_1 = __importDefault(require("../controllers/liquidityVolume"));
const metadata_1 = __importDefault(require("../controllers/metadata"));
const router = express_1.default.Router();
// [ pool ]
router.get("/all-pools", pool_1.default.getAllPools);
router.get("/pool/:pool_id", pool_1.default.getPool);
router.post("/latest-pool", pool_1.default.postLatestPool);
router.post("/update/:pool_id/:totalShares/:amounts", pool_1.default.updatePool);
// [Token price]
router.get("/token-price-usd", tokenPrice_1.default.getTokenPrice);
// [whitelisted token]
router.get("/whitelisted-token", whitelistedToken_1.default.getWhiteListToken);
// [ volume ]
router.get("/get-5m-swap-volume/:pool_id", swapVolume_1.default.get5mSwapVolume);
router.get("/get-15m-swap-volume/:pool_id", swapVolume_1.default.get15mSwapVolume);
router.get("/get-30m-swap-volume/:pool_id", swapVolume_1.default.get30mSwapVolume);
router.get("/get-1h-swap-volume/:pool_id", swapVolume_1.default.get1hSwapVolume);
router.get("/get-4h-swap-volume/:pool_id", swapVolume_1.default.get4hSwapVolume);
router.get("/get-1day-swap-volume/:pool_id", swapVolume_1.default.get1daySwapVolume);
router.get("/get-4days-swap-volume/:pool_id", swapVolume_1.default.get4daysSwapVolume);
router.get("/get-7days-swap-volume/:pool_id", swapVolume_1.default.get7daysSwapVolume);
router.post("/post-swap-volume", swapVolume_1.default.updateNewSwapVolume);
router.delete("/delete-volume", swapVolume_1.default.deleteAll);
// [ liquidity volume ]
router.get("/get-5m-liquidity-volume/:pool_id", liquidityVolume_1.default.get5mLiquidityVolume);
router.get("/get-15m-liquidity-volume/:pool_id", liquidityVolume_1.default.get15mLiquidityVolume);
router.get("/get-30m-liquidity-volume/:pool_id", liquidityVolume_1.default.get30mLiquidityVolume);
router.get("/get-1h-liquidity-volume/:pool_id", liquidityVolume_1.default.get1hLiquidityVolume);
router.get("/get-4h-liquidity-volume/:pool_id", liquidityVolume_1.default.get4hLiquidityVolume);
router.get("/get-1day-liquidity-volume/:pool_id", liquidityVolume_1.default.get1dayLiquidityVolume);
router.get("/get-4days-liquidity-volume/:pool_id", liquidityVolume_1.default.get4daysLiquidityVolume);
router.get("/get-7days-liquidity-volume/:pool_id", liquidityVolume_1.default.get7daysLiquidityVolume);
router.post("/post-liquidity-volume", liquidityVolume_1.default.updateNewLiquidityVolume);
router.delete("/delete-all-liquidity-volume", liquidityVolume_1.default.deleteAll);
// [ metadata ]
router.get("/get-unique-metadata", metadata_1.default.getUniqueMetadata);
router.post("/upsert-metadata", metadata_1.default.upsertMetadata);
module.exports = router;
//# sourceMappingURL=index.js.map