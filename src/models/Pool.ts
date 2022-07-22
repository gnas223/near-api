import mongoose, { Schema } from "mongoose";
import Pool from '../interface/Pool';

const PoolSchema: Schema = new Schema({
    amounts: {type: [String]},
    amp: Number,
    pool_id: {type: Number},
    share_total_supply: {type: String},
    pool_kind: {type: String},
    token_account_ids: {type: [String]},
    total_fee: {type: Number},
    icons: {type: {}},
    symbols: {type: {}},
    totalShares: {type: String},
    decimals: {type: {}},
},{
    timestamps: true,
    collection: 'pool'
})

export default mongoose.model<Pool>('pool', PoolSchema);