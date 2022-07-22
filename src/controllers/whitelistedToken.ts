import { Request, Response, NextFunction } from 'express'
import WhitelistedTokenSchema from '../models/WhitelistedToken';

const getWhiteListToken = (req: Request, res: Response, next: NextFunction) => {
    WhitelistedTokenSchema.find()
        .exec()
        .then((token) => res.status(200).json(token))
        .catch(next)
}

export default {getWhiteListToken}