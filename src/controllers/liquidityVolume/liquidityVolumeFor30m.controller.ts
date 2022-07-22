import mongoose, { Schema } from "mongoose";
import liquidityVolume from "../../interface/liquidityVolume";
import { Request, Response, NextFunction } from "express";
import schedule from "node-schedule";
import PoolSchema from "../../models/Pool";
import liquidityVolumeFor15mModel from "../../models/liquidityVolume/liquidityVolumeFor15m.model";
import liquidityVolumeFor30mModel from "../../models/liquidityVolume/liquidityVolumeFor30m.model";

schedule.scheduleJob("*/31 * * * *", async function () {
  console.log("liquidity has created new doc 30m!");
  const pools = await PoolSchema.find();
  const poolsSorted = pools.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  //set limit to get 2 latest doc for 1 pool
  const LIMIT_DOC = 2;
  const twoLiquidityVolumeLatest = await liquidityVolumeFor15mModel
    .find()
    .sort({ createAt: -1 })
    .limit(pools.length * LIMIT_DOC);

  const twoLiquidityVolumeLatestSorted = twoLiquidityVolumeLatest.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  let index = 0;
  const dateTimeFor30Minute = twoLiquidityVolumeLatestSorted[0].datetime;
  for (const pool of poolsSorted) {
    const totalToken1OfPool =
      Number(
        twoLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        twoLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[0]
        ]
      );
    const totalToken2OfPool =
      Number(
        twoLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        twoLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[1]
        ]
      );
    const totalLiquidityDollar =
      Number(twoLiquidityVolumeLatestSorted[index].liquidity_dollar) +
      Number(twoLiquidityVolumeLatestSorted[index + 1].liquidity_dollar);
    liquidityVolumeFor30mModel.create({
      pool_id: pool.pool_id,
      liquidity: {
        [pool.token_account_ids[0]]: totalToken1OfPool.toString(),

        [pool.token_account_ids[1]]: totalToken2OfPool.toString(),
      },
      liquidity_dollar: totalLiquidityDollar.toString(),
      datetime: dateTimeFor30Minute,
    });
    index += 2;
  }

  const allLiquidityVolumes = await liquidityVolumeFor30mModel.find({});
  const limitDoc = 8;
  if (allLiquidityVolumes.length > pools.length * limitDoc) {
    const olderLiquidityVolumes = await liquidityVolumeFor30mModel
      .find({})
      .sort({ createAt: 1 })
      .limit(1);
    await liquidityVolumeFor30mModel.deleteMany({
      datetime: olderLiquidityVolumes[0].datetime,
    });
    console.log("delete success older liquidity volume 30m!");
  }
});
const getAllLiquidityVolume30m = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allLiquidityVolume30m = await liquidityVolumeFor30mModel.find({});
  return res.status(200).json(allLiquidityVolume30m);
};
export default {
  getAllLiquidityVolume30m,
};
