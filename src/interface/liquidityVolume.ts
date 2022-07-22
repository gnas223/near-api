import { Document } from "mongoose";

export default interface liquidityVolume extends Document {
  pool_id: number;
  liquidity: {
    [key: string]: string;
  };
  datetime: string;
  liquidity_dollar: string;
}
