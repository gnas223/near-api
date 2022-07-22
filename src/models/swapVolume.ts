import mongoose, { Schema } from "mongoose";
import swapVolume from '../interface/swapVolume';

const swapVolumeSchema: Schema = new Schema({
    pool_id: {type: Number },
    volume: { type: Object },
    volume_dollar: { type: String },
    datetime: { type: String },
},{
    timestamps: true,
    collection: 'volume'
})

export default mongoose.model<swapVolume>('swapVolume', swapVolumeSchema);