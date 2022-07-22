import mongoose, { Schema } from "mongoose";
import WhitelistedToken from "../interface/WhitelistedToken";

const WhitelistedTokenSchema: Schema = new Schema({
    id: { type: String },
    name: { type: String },
    decimals: { type: Number },
    icon: { type: String },
    symbol: { type: String },
}, {
    timestamps: true,
    collection: 'WhitelistedTokenMainnet',
})

export default mongoose.model<WhitelistedToken>('WhitelistedTokenMainnet', WhitelistedTokenSchema)