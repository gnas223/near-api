import express from "express";
import poolController from "../controllers/pool";
import tokenPriceController from "../controllers/tokenPrice";
import whitelistedTokenController from "../controllers/whitelistedToken";
import swapVolumeController from "../controllers/swapVolume";
import liquidityVolumeController from "../controllers/liquidityVolume";
import metadataController from "../controllers/metadata";
import Liquidity5m from "../controllers/liquidityVolume/liquidityVolumeFor5m.controller";
import Liquidity15m from "../controllers/liquidityVolume/liquidityVolumeFor15m.controller";
import Liquidity30m from "../controllers/liquidityVolume/liquidityVolumeFor30m.controller";
import Liquidity1h from "../controllers/liquidityVolume/liquidityVolumeFor1h.controller";
import Liquidity4h from "../controllers/liquidityVolume/liquidityVolumeFor4h.controller";
import Liquidity1d from "../controllers/liquidityVolume/liquidityVolumeFor1d.controller";
import Liquidity4d from "../controllers/liquidityVolume/liquidityVolumeFor4d.controller";
import Liquidity7d from "../controllers/liquidityVolume/liquidityVolumeFor7d.controller";

const router = express.Router();

// [ pool ]
router.get("/all-pools", poolController.getAllPools);

router.get("/pool/:pool_id", poolController.getPool);

router.post("/latest-pool", poolController.postLatestPool);

router.post(
  "/update/:pool_id/:totalShares/:amounts",
  poolController.updatePool
);

// [Token price]
router.get("/token-price-usd", tokenPriceController.getTokenPrice);

// [whitelisted token]
router.get("/whitelisted-token", whitelistedTokenController.getWhiteListToken);

// [ volume ]
router.get(
  "/get-5m-swap-volume/:pool_id",
  swapVolumeController.get5mSwapVolume
);

router.get(
  "/get-15m-swap-volume/:pool_id",
  swapVolumeController.get15mSwapVolume
);

router.get(
  "/get-30m-swap-volume/:pool_id",
  swapVolumeController.get30mSwapVolume
);

router.get(
  "/get-1h-swap-volume/:pool_id",
  swapVolumeController.get1hSwapVolume
);

router.get(
  "/get-4h-swap-volume/:pool_id",
  swapVolumeController.get4hSwapVolume
);

router.get(
  "/get-1day-swap-volume/:pool_id",
  swapVolumeController.get1daySwapVolume
);

router.get(
  "/get-4days-swap-volume/:pool_id",
  swapVolumeController.get4daysSwapVolume
);

router.get(
  "/get-7days-swap-volume/:pool_id",
  swapVolumeController.get7daysSwapVolume
);

router.post("/post-swap-volume", swapVolumeController.updateNewSwapVolume);

router.delete("/delete-volume", swapVolumeController.deleteAll);

// [ liquidity volume ]
router.get(
  "/get-5m-liquidity-volume/:pool_id",
  liquidityVolumeController.get5mLiquidityVolume
);

router.get(
  "/get-15m-liquidity-volume/:pool_id",
  liquidityVolumeController.get15mLiquidityVolume
);

router.get(
  "/get-30m-liquidity-volume/:pool_id",
  liquidityVolumeController.get30mLiquidityVolume
);

router.get(
  "/get-1h-liquidity-volume/:pool_id",
  liquidityVolumeController.get1hLiquidityVolume
);

router.get(
  "/get-4h-liquidity-volume/:pool_id",
  liquidityVolumeController.get4hLiquidityVolume
);

router.get(
  "/get-1day-liquidity-volume/:pool_id",
  liquidityVolumeController.get1dayLiquidityVolume
);

router.get(
  "/get-4days-liquidity-volume/:pool_id",
  liquidityVolumeController.get4daysLiquidityVolume
);

router.get(
  "/get-7days-liquidity-volume/:pool_id",
  liquidityVolumeController.get7daysLiquidityVolume
);

router.post(
  "/post-liquidity-volume",
  liquidityVolumeController.updateNewLiquidityVolume
);

router.delete(
  "/delete-all-liquidity-volume",
  liquidityVolumeController.deleteAll
);

// [ metadata ]

router.get("/get-unique-metadata", metadataController.getUniqueMetadata);

router.post("/upsert-metadata", metadataController.upsertMetadata);

// test liquidityVolume
router.get("/all-liquidity5m", Liquidity5m.getAllLiquidityVolume5m);
router.get("/all-liquidity15m", Liquidity15m.getAllLiquidityVolume15m);
router.get("/all-liquidity30m", Liquidity30m.getAllLiquidityVolume30m);
router.get("/all-liquidity1h", Liquidity1h.getAllLiquidityVolume1h);
router.get("/all-liquidity4h", Liquidity4h.getAllLiquidityVolume4h);
router.get("/all-liquidity1d", Liquidity1d.getAllLiquidityVolume1d);
router.get("/all-liquidity4d", Liquidity4d.getAllLiquidityVolume4d);
router.get("/all-liquidity7d", Liquidity7d.getAllLiquidityVolume7d);
export = router;
