import { Request, Response, NextFunction } from "express";
import PoolSchema from "../models/Pool";
import Pool from "../interface/Pool";
import liquidityVolume from "../models/liquidityVolume";

const getAllPools = (req: Request, res: Response, next: NextFunction) => {
  PoolSchema.find()
    .exec()
    .then((pool) => res.status(200).json(pool))
    .catch(next);
};

const getPool = (req: Request, res: Response, next: NextFunction) => {
  let pool_id = req.params.pool_id;
  PoolSchema.findOne({ pool_id: Number(pool_id) })
    .exec()
    .then((pool) => res.status(200).json(pool))
    .catch(next);
};

// [POST]

const postLatestPool = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const checkUtcNow = `${now.getUTCMinutes().toString().padStart(2, "0")}`;
  const formData = req.body;
  const newPool = JSON.parse(formData.newPool);
  const latestPool = new PoolSchema(newPool);
  latestPool
    .save()
    .then(async (pool: Pool) => {
      let minute = Number(checkUtcNow);
      if (Number(checkUtcNow) % 5 !== 0) {
        while (minute % 5 !== 0) {
          minute++;
        }
      } else {
        minute += 5;
      }
      const utcNow = `${now.getUTCFullYear()}-${
        now.getUTCMonth() + 1
      }-${now.getUTCDate()} ${now
        .getUTCHours()
        .toString()
        .padStart(2, "0")}:${minute.toString()}:00`;
      liquidityVolume.create({
        pool_id: pool.pool_id,
        liquidity: {
          [pool.token_account_ids[0]]: "",
          [pool.token_account_ids[1]]: "",
        },
        liquidity_dollar: "0",
        datetime: utcNow,
      });
      console.log("success import data");
      return res.status(200).json(pool);
    })
    .catch(next);
};

// [PUT]

const updatePool = (req: Request, res: Response, next: NextFunction) => {
  const { pool_id, totalShares, amounts } = req.params;
  const arr = amounts.split(",");

  PoolSchema.findOneAndUpdate(
    { pool_id: Number(pool_id) },
    { totalShares, amounts: arr }
  )
    .exec()
    .then((pool) => res.status(200).json(pool))
    .catch(next);
};

export default { getAllPools, getPool, postLatestPool, updatePool };
