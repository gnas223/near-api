import { Request, Response, NextFunction } from "express";
import schedule from "node-schedule";
import PoolSchema from "../../models/Pool";
import liquidityVolumeFor1dModel from "../../models/liquidityVolume/liquidityVolumeFor1d.model";
import liquidityVolumeFor7dModel from "../../models/liquidityVolume/liquidityVolumeFor7d.model";

schedule.scheduleJob("4 * */7 * *", async function () {
  console.log("liquidity has created new doc 7d!");
  const pools = await PoolSchema.find();
  const poolsSorted = pools.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  //set limit to get 4 latest doc for 1 pool
  const LIMIT_DOC = 7;
  //get all 3 liquidity latest of pools
  const sevenLiquidityVolumeLatest = await liquidityVolumeFor1dModel
    .find()
    .sort({ createAt: -1 })
    .limit(pools.length * LIMIT_DOC);
  // sort liquidity volume to calc total for current time
  const sevenLiquidityVolumeLatestSorted = sevenLiquidityVolumeLatest.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  let index = 0;
  const dateTimeFor15Minute = sevenLiquidityVolumeLatestSorted[0].datetime;
  for (const pool of poolsSorted) {
    //total of properties for new doc current time
    //total token 1 of a pool
    const totalToken1OfPool =
      Number(
        sevenLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 2].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 3].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 4].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 5].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 6].liquidity[
          pool.token_account_ids[0]
        ]
      );
    //total token 2 of a pool
    const totalToken2OfPool =
      Number(
        sevenLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 2].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 3].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 4].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 5].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sevenLiquidityVolumeLatestSorted[index + 6].liquidity[
          pool.token_account_ids[1]
        ]
      );
    //total cost of liquidity
    const totalLiquidityDollar =
      Number(sevenLiquidityVolumeLatestSorted[index].liquidity_dollar) +
      Number(sevenLiquidityVolumeLatestSorted[index + 1].liquidity_dollar) +
      Number(sevenLiquidityVolumeLatestSorted[index + 2].liquidity_dollar) +
      Number(sevenLiquidityVolumeLatestSorted[index + 3].liquidity_dollar) +
      Number(sevenLiquidityVolumeLatestSorted[index + 4].liquidity_dollar) +
      Number(sevenLiquidityVolumeLatestSorted[index + 5].liquidity_dollar) +
      Number(sevenLiquidityVolumeLatestSorted[index + 6].liquidity_dollar);
    //create doc to database
    liquidityVolumeFor7dModel.create({
      pool_id: pool.pool_id,
      liquidity: {
        [pool.token_account_ids[0]]: totalToken1OfPool.toString(),

        [pool.token_account_ids[1]]: totalToken2OfPool.toString(),
      },
      liquidity_dollar: totalLiquidityDollar.toString(),
      datetime: dateTimeFor15Minute,
    });
    index += 7;
  }

  const allLiquidityVolumes = await liquidityVolumeFor7dModel.find({});
  //setting in history liquidity = 8 doc for a pool
  const limitDoc = 8;
  //if a pool have total doc > 8 then delete all oldest doc of a pool
  if (allLiquidityVolumes.length > pools.length * limitDoc) {
    const olderLiquidityVolumes = await liquidityVolumeFor7dModel
      .find({})
      .sort({ createAt: 1 })
      .limit(1);
    await liquidityVolumeFor7dModel.deleteMany({
      datetime: olderLiquidityVolumes[0].datetime,
    });
    console.log("delete success older liquidity volume 7d!");
  }
});
const getAllLiquidityVolume7d = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allLiquidityVolume7d = await liquidityVolumeFor7dModel.find();
  return res.status(200).json(allLiquidityVolume7d);
};
export default {
  getAllLiquidityVolume7d,
};
