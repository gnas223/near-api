import mongoose, { Schema } from "mongoose";
import metadata from "../interface/metadata";

const metadataSchema: Schema = new Schema({
    metadata: {type: Object}
},{
    timestamps: true,
    collection: 'metadata'
})

export default mongoose.model<metadata>('metadata', metadataSchema)