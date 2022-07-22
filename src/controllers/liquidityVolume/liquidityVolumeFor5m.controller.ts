import { Request, Response, NextFunction } from "express";
import liquidityVolumeFor5mModel from "../../models/liquidityVolume/liquidityVolumeFor5m.model";
import schedule from "node-schedule";
import PoolSchema from "../../models/Pool";
// after 5 minute function is called to create new liquidity volume and remove older liquidity volume
schedule.scheduleJob("*/5 * * * *", async function () {
  console.log("liquidity has created new doc 5m!");
  const now = new Date();
  const utcNow = `${now.getUTCFullYear()}-${
    now.getUTCMonth() + 1
  }-${now.getUTCDate()} ${now.getUTCHours().toString().padStart(2, "0")}:${now
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:00`;
  const pools = await PoolSchema.find();
  // get pool_id for new pool when user was created
  const getLatestPoolId = await liquidityVolumeFor5mModel.findOne({
    pool_id: pools[pools.length - 1].pool_id,
  });
  if (getLatestPoolId?.datetime !== utcNow) {
    for (const pool of pools) {
      liquidityVolumeFor5mModel.create({
        pool_id: pool.pool_id,
        liquidity: {
          [pool.token_account_ids[0]]: "0",
          [pool.token_account_ids[1]]: "0",
        },
        liquidity_dollar: "0",
        datetime: utcNow,
      });
    }
  }
  const allLiquidityVolumes = await liquidityVolumeFor5mModel.find({});
  const limitDoc = 8;
  if (allLiquidityVolumes.length > pools.length * limitDoc) {
    const olderLiquidityVolumes = await liquidityVolumeFor5mModel
      .find({})
      .sort({ createAt: 1 })
      .limit(1);
    await liquidityVolumeFor5mModel.deleteMany({
      datetime: olderLiquidityVolumes[0].datetime,
    });
    console.log("delete success older liquidity volume 5m!");
  }
});

const getAllLiquidityVolume5m = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allLiquidityVolume5m = await liquidityVolumeFor5mModel.find();

  return res.status(200).json(allLiquidityVolume5m);
};

export default { getAllLiquidityVolume5m };
