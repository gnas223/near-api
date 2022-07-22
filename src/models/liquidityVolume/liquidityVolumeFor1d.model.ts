import mongoose, { Schema } from "mongoose";
import liquidityVolume from "../../interface/liquidityVolume";

const liquidityVolume1dSchema: Schema = new Schema(
  {
    pool_id: { type: Number },
    liquidity: { type: Object },
    datetime: { type: String },
    liquidity_dollar: { type: String },
  },
  {
    timestamps: true,
    collection: "liquidityVolumeFor1d",
  }
);

export default mongoose.model<liquidityVolume>(
  "liquidityVolumeFor1d",
  liquidityVolume1dSchema
);
