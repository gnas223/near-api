import { Request, Response, NextFunction } from "express";
import schedule from "node-schedule";
import PoolSchema from "../../models/Pool";
import liquidityVolumeFor5mModel from "../../models/liquidityVolume/liquidityVolumeFor5m.model";
import liquidityVolumeFor15mModel from "../../models/liquidityVolume/liquidityVolumeFor15m.model";

schedule.scheduleJob("30 */15 * * * *", async function () {
  console.log("liquidity has created new doc 15m!");
  const pools = await PoolSchema.find();
  const poolsSorted = pools.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  //set limit to get 3 latest doc for 1 pool
  const LIMIT_DOC = 3;
  //get all 3 liquidity latest of pools
  const threeLiquidityVolumeLatest = await liquidityVolumeFor5mModel
    .find()
    .sort({ createAt: -1 })
    .limit(pools.length * LIMIT_DOC);
  // sort liquidity volume to calc total for current time
  const threeLiquidityVolumeLatestSorted = threeLiquidityVolumeLatest.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  let index = 0;
  const dateTimeFor15Minute = threeLiquidityVolumeLatestSorted[0].datetime;
  for (const pool of poolsSorted) {
    //total of properties for new doc current time
    //total token 1 of a pool
    const totalToken1OfPool =
      Number(
        threeLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        threeLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        threeLiquidityVolumeLatestSorted[index + 2].liquidity[
          pool.token_account_ids[0]
        ]
      );
    //total token 2 of a pool
    const totalToken2OfPool =
      Number(
        threeLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        threeLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        threeLiquidityVolumeLatestSorted[index + 2].liquidity[
          pool.token_account_ids[1]
        ]
      );
    //total cost of liquidity
    const totalLiquidityDollar =
      Number(threeLiquidityVolumeLatestSorted[index].liquidity_dollar) +
      Number(threeLiquidityVolumeLatestSorted[index + 1].liquidity_dollar) +
      Number(threeLiquidityVolumeLatestSorted[index + 2].liquidity_dollar);
    //create doc to database
    liquidityVolumeFor15mModel.create({
      pool_id: pool.pool_id,
      liquidity: {
        [pool.token_account_ids[0]]: totalToken1OfPool.toString(),

        [pool.token_account_ids[1]]: totalToken2OfPool.toString(),
      },
      liquidity_dollar: totalLiquidityDollar.toString(),
      datetime: dateTimeFor15Minute,
    });
    index += 3;
  }

  const allLiquidityVolumes = await liquidityVolumeFor15mModel.find({});
  //setting in history liquidity = 8 doc for a pool
  const limitDoc = 8;
  //if a pool have total doc > 8 then delete all oldest doc of a pool
  if (allLiquidityVolumes.length > pools.length * limitDoc) {
    const olderLiquidityVolumes = await liquidityVolumeFor15mModel
      .find({})
      .sort({ createAt: 1 })
      .limit(1);
    await liquidityVolumeFor15mModel.deleteMany({
      datetime: olderLiquidityVolumes[0].datetime,
    });
    console.log("delete success older liquidity volume 15m!");
  }
});
const getAllLiquidityVolume15m = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allLiquidityVolume15 = await liquidityVolumeFor15mModel.find();
  return res.status(200).json(allLiquidityVolume15);
};
export default {
  getAllLiquidityVolume15m,
};
