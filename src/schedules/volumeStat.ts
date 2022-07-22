import schedule from "node-schedule"
import PoolSchema from "../models/Pool"
import volume from "../models/swapVolume";

// schedule tasks
schedule.scheduleJob('*/5 * * * *', async function(){
    console.log('Volume has created new document');
    const now = new Date()
    const utcNow = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate().toString().padStart(2, "0")} ${now.getUTCHours().toString().padStart(2, "0")}:${now.getUTCMinutes()}:00`
    const pools = await PoolSchema.find();
    for (const pool of pools) {
        volume.create({
            pool_id: pool.pool_id,
            volume: {
                [pool.token_account_ids[0]]: "",
                [pool.token_account_ids[1]]: "",
            },
            volume_dollar: "0",
            datetime: utcNow
        })
    }
});
