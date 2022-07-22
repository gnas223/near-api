import mongoose, { Schema } from "mongoose";
import liquidityVolume from "../../interface/liquidityVolume";

const liquidityVolume5mSchema: Schema = new Schema(
  {
    pool_id: { type: Number },
    liquidity: { type: Object },
    datetime: { type: String },
    liquidity_dollar: { type: String },
  },
  {
    timestamps: true,
    collection: "liquidityVolumeFor5m",
  }
);

export default mongoose.model<liquidityVolume>(
  "liquidityVolumeFor5m",
  liquidityVolume5mSchema
);
