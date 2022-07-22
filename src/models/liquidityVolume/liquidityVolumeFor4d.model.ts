import mongoose, { Schema } from "mongoose";
import liquidityVolume from "../../interface/liquidityVolume";

const liquidityVolume4dSchema: Schema = new Schema(
  {
    pool_id: { type: Number },
    liquidity: { type: Object },
    datetime: { type: String },
    liquidity_dollar: { type: String },
  },
  {
    timestamps: true,
    collection: "liquidityVolumeFor4d",
  }
);

export default mongoose.model<liquidityVolume>(
  "liquidityVolumeFor4d",
  liquidityVolume4dSchema
);
