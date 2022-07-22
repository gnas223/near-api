import { Request, Response, NextFunction } from "express";
import metadataSchema from "../models/metadata";
import metadata from "../interface/metadata";

const upsertMetadata = (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const metadata: Object = JSON.parse(formData.data)
    
    metadataSchema.findOneAndUpdate({}, {metadata}, { new: true, upsert: true})
        .then((metadata: metadata) => res.status(200).json(metadata))
        .catch(next)

}

const getUniqueMetadata = (req: Request, res: Response, next: NextFunction) => {
    metadataSchema.find()
        .then((metadata) => res.status(200).json(metadata[0].metadata))
        .catch(next)
}

export default { getUniqueMetadata ,upsertMetadata }