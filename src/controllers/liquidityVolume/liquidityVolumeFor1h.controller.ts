import { Request, Response, NextFunction } from "express";
import schedule from "node-schedule";
import PoolSchema from "../../models/Pool";
import liquidityVolumeFor30mModel from "../../models/liquidityVolume/liquidityVolumeFor30m.model";
import liquidityVolumeFor1hModel from "../../models/liquidityVolume/liquidityVolumeFor1h.model";

schedule.scheduleJob("30 1 */1 * * *", async function () {
  console.log("liquidity has created new doc 1h!");
  const pools = await PoolSchema.find();
  const poolsSorted = pools.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  //set limit to get 3 latest doc for 1 pool
  const LIMIT_DOC = 2;
  const twoLiquidityVolumeLatest = await liquidityVolumeFor30mModel
    .find()
    .sort({ createAt: -1 })
    .limit(pools.length * LIMIT_DOC);

  const twoLiquidityVolumeLatestSorted = twoLiquidityVolumeLatest.sort(
    (firstDoc, secondDoc) => firstDoc.pool_id - secondDoc.pool_id
  );
  let index = 0;
  const dateTimeFor1hMinute = twoLiquidityVolumeLatestSorted[0].datetime;
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
    liquidityVolumeFor1hModel.create({
      pool_id: pool.pool_id,
      liquidity: {
        [pool.token_account_ids[0]]: totalToken1OfPool.toString(),

        [pool.token_account_ids[1]]: totalToken2OfPool.toString(),
      },
      liquidity_dollar: totalLiquidityDollar.toString(),
      datetime: dateTimeFor1hMinute,
    });
    index += 2;
  }

  const allLiquidityVolumes = await liquidityVolumeFor1hModel.find({});
  const limitDoc = 8;
  if (allLiquidityVolumes.length > pools.length * limitDoc) {
    const olderLiquidityVolumes = await liquidityVolumeFor1hModel
      .find({})
      .sort({ createAt: 1 })
      .limit(1);
    await liquidityVolumeFor1hModel.deleteMany({
      datetime: olderLiquidityVolumes[0].datetime,
    });
    console.log("delete success older liquidity volume 1h!");
  }
});
const getAllLiquidityVolume1h = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allLiquidityVolume1h = await liquidityVolumeFor1hModel.find({});
  return res.status(200).json(allLiquidityVolume1h);
};
export default {
  getAllLiquidityVolume1h,
};
