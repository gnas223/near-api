import { Document } from "mongoose";

export default interface WhitelistedToken extends Document {
    id: string,
    name: string,
    decimals: number,
    icon: string,
    symbol: string,
}