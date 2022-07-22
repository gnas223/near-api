import { Document } from "mongoose";

export default interface Pool extends Document {
    amounts: string,
    amp: number,
    pool_id: number,
    share_total_supply: string,
    pool_kind: string,
    token_account_ids: Array<string>,
    total_fee: number,
    icons: Object,
    symbols: Object,
    totalShares: string,
    decimals: Object
}