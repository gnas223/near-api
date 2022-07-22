import { Request, Response, NextFunction } from "express";
import schedule from "node-schedule";
import PoolSchema from "../../models/Pool";
import liquidityVolumeFor4hModel from "../../models/liquidityVolume/liquidityVolumeFor4h.model";
import liquidityVolumeFor1dModel from "../../models/liquidityVolume/liquidityVolumeFor1d.model";

schedule.scheduleJob("3 * */1 * *", async function () {
  console.log("liquidity has created new doc 1d!");
  const pools = await PoolSchema.find();
  const poolsSorted = pools.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  //set limit to get 4 latest doc for 1 pool
  const LIMIT_DOC = 6;
  //get all 3 liquidity latest of pools
  const sixLiquidityVolumeLatest = await liquidityVolumeFor4hModel
    .find()
    .sort({ createAt: -1 })
    .limit(pools.length * LIMIT_DOC);
  // sort liquidity volume to calc total for current time
  const sixLiquidityVolumeLatestSorted = sixLiquidityVolumeLatest.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  let index = 0;
  const dateTimeFor1Day = sixLiquidityVolumeLatestSorted[0].datetime;
  for (const pool of poolsSorted) {
    //total of properties for new doc current time
    //total token 1 of a pool
    const totalToken1OfPool =
      Number(
        sixLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 2].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 3].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 4].liquidity[
          pool.token_account_ids[0]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 5].liquidity[
          pool.token_account_ids[0]
        ]
      );
    //total token 2 of a pool
    const totalToken2OfPool =
      Number(
        sixLiquidityVolumeLatestSorted[index].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 1].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 2].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 3].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 4].liquidity[
          pool.token_account_ids[1]
        ]
      ) +
      Number(
        sixLiquidityVolumeLatestSorted[index + 5].liquidity[
          pool.token_account_ids[1]
        ]
      );
    //total cost of liquidity
    const totalLiquidityDollar =
      Number(sixLiquidityVolumeLatestSorted[index].liquidity_dollar) +
      Number(sixLiquidityVolumeLatestSorted[index + 1].liquidity_dollar) +
      Number(sixLiquidityVolumeLatestSorted[index + 2].liquidity_dollar) +
      Number(sixLiquidityVolumeLatestSorted[index + 3].liquidity_dollar) +
      Number(sixLiquidityVolumeLatestSorted[index + 4].liquidity_dollar) +
      Number(sixLiquidityVolumeLatestSorted[index + 5].liquidity_dollar);
    //create doc to database
    liquidityVolumeFor1dModel.create({
      pool_id: pool.pool_id,
      liquidity: {
        [pool.token_account_ids[0]]: totalToken1OfPool.toString(),

        [pool.token_account_ids[1]]: totalToken2OfPool.toString(),
      },
      liquidity_dollar: totalLiquidityDollar.toString(),
      datetime: dateTimeFor1Day,
    });
    index += 6;
  }

  const allLiquidityVolumes = await liquidityVolumeFor1dModel.find({});
  //setting in history liquidity = 8 doc for a pool
  const limitDoc = 8;
  //if a pool have total doc > 8 then delete all oldest doc of a pool
  if (allLiquidityVolumes.length > pools.length * limitDoc) {
    const olderLiquidityVolumes = await liquidityVolumeFor1dModel
      .find({})
      .sort({ createAt: 1 })
      .limit(1);
    await liquidityVolumeFor1dModel.deleteMany({
      datetime: olderLiquidityVolumes[0].datetime,
    });
    console.log("delete success older liquidity volume 1d!");
  }
});
const getAllLiquidityVolume1d = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allLiquidityVolume1d = await liquidityVolumeFor1dModel.find();
  return res.status(200).json(allLiquidityVolume1d);
};
export default {
  getAllLiquidityVolume1d,
};
