import { Request, Response, NextFunction } from "express";
import schedule from "node-schedule";
import PoolSchema from "../../models/Pool";
import liquidityVolumeFor1hModel from "../../models/liquidityVolume/liquidityVolumeFor1h.model";
import liquidityVolumeFor4hModel from "../../models/liquidityVolume/liquidityVolumeFor4h.model";

schedule.scheduleJob("2 */4 * * *", async function () {
  console.log("liquidity has created new doc 4h!");
  const pools = await PoolSchema.find();
  const poolsSorted = pools.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  //set limit to get 4 latest doc for 1 pool
  const LIMIT_DOC = 4;
  //get all 3 liquidity latest of pools
  const fourLiquidityVolumeLatest = await liquidityVolumeFor1hModel
    .find()
    .sort({ createAt: -1 })
    .limit(pools.length * LIMIT_DOC);
  // sort liquidity volume to calc total for current time
  const fourLiquidityVolumeLatestSorted = fourLiquidityVolumeLatest.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  let index = 0;
  const dateTimeFor15Minute = fourLiquidityVolumeLatestSorted[0].datetime;
  for (const pool of poolsSorted) {
    //total of properties for new doc current time
    //total token 1 of a pool
    const totalToken1OfPool =
      Number(
        fourLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        fourLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        fourLiquidityVolumeLatestSorted[index + 2].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        fourLiquidityVolumeLatestSorted[index + 3].liquidity[
          pool.token_account_ids[0]
        ]
      );
    //total token 2 of a pool
    const totalToken2OfPool =
      Number(
        fourLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        fourLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        fourLiquidityVolumeLatestSorted[index + 2].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        fourLiquidityVolumeLatestSorted[index + 3].liquidity[
          pool.token_account_ids[1]
        ]
      );
    //total cost of liquidity
    const totalLiquidityDollar =
      Number(fourLiquidityVolumeLatestSorted[index].liquidity_dollar) +
      Number(fourLiquidityVolumeLatestSorted[index + 1].liquidity_dollar) +
      Number(fourLiquidityVolumeLatestSorted[index + 2].liquidity_dollar) +
      Number(fourLiquidityVolumeLatestSorted[index + 3].liquidity_dollar);
    //create doc to database
    liquidityVolumeFor4hModel.create({
      pool_id: pool.pool_id,
      liquidity: {
        [pool.token_account_ids[0]]: totalToken1OfPool.toString(),

        [pool.token_account_ids[1]]: totalToken2OfPool.toString(),
      },
      liquidity_dollar: totalLiquidityDollar.toString(),
      datetime: dateTimeFor15Minute,
    });
    index += 4;
  }

  const allLiquidityVolumes = await liquidityVolumeFor4hModel.find({});
  //setting in history liquidity = 8 doc for a pool
  const limitDoc = 8;
  //if a pool have total doc > 8 then delete all oldest doc of a pool
  if (allLiquidityVolumes.length > pools.length * limitDoc) {
    const olderLiquidityVolumes = await liquidityVolumeFor4hModel
      .find({})
      .sort({ createAt: 1 })
      .limit(1);
    await liquidityVolumeFor4hModel.deleteMany({
      datetime: olderLiquidityVolumes[0].datetime,
    });
    console.log("delete success older liquidity volume 4h!");
  }
});
const getAllLiquidityVolume4h = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allLiquidityVolume4h = await liquidityVolumeFor4hModel.find();
  return res.status(200).json(allLiquidityVolume4h);
};
export default {
  getAllLiquidityVolume4h,
};
