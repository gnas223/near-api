import mongoose, { Schema } from 'mongoose';
import liquidityVolume from '../interface/liquidityVolume';

const liquidityVolumeSchema: Schema = new Schema({
    pool_id: {type: Number},
    liquidity: { type: Object },
    datetime: { type: String },
    liquidity_dollar: { type: String }
},{
    timestamps: true,
    collection: 'liquidityVolume'
})

export default mongoose.model<liquidityVolume>('liquidityVolume', liquidityVolumeSchema)