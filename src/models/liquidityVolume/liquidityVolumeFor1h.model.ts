import mongoose, { Schema } from "mongoose";
import liquidityVolume from "../../interface/liquidityVolume";

const liquidityVolume1hSchema: Schema = new Schema(
  {
    pool_id: { type: Number },
    liquidity: { type: Object },
    datetime: { type: String },
    liquidity_dollar: { type: String },
  },
  {
    timestamps: true,
    collection: "liquidityVolumeFor1h",
  }
);

export default mongoose.model<liquidityVolume>(
  "liquidityVolumeFor1h",
  liquidityVolume1hSchema
);
