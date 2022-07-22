import mongoose, { Schema } from "mongoose";
import TokenPrice from "../interface/TokenPrice";

const TokenPriceSchema: Schema = new Schema({
    tokenPrice: {type: Object}
}, {
    timestamps: true,
    collection: 'tokenPrice',
})

export default mongoose.model<TokenPrice>('tokenPrice', TokenPriceSchema)