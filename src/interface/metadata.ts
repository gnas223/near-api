import { Document } from "mongoose";

export default interface metadata extends Document {
    metadata: Object
}