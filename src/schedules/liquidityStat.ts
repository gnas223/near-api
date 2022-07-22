import schedule from "node-schedule";
import PoolSchema from "../models/Pool";
import liquidityVolume from "../models/liquidityVolume";

// schedule tasks
schedule.scheduleJob("*/5 * * * *", async function () {
  console.log("liquidity has created new doc!");
  const now = new Date();
  const utcNow = `${now.getUTCFullYear()}-${
    now.getUTCMonth() + 1
  }-${now.getUTCDate()} ${now.getUTCHours().toString().padStart(2, "0")}:${now
    .getUTCMinutes()
    .toString()
    .padStart(2, "0")}:00`;
  const pools = await PoolSchema.find();
  const getLatestPoolId = await liquidityVolume.findOne({
    pool_id: pools[pools.length - 1].pool_id,
  });
  if (getLatestPoolId?.datetime !== utcNow) {
    for (const pool of pools) {
      liquidityVolume.create({
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
