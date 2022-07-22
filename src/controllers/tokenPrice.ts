import { Request, Response, NextFunction } from 'express'
import TokenPriceSchema from '../models/TokenPrice';


const getTokenPrice = (req: Request, res: Response, next: NextFunction) => {
    TokenPriceSchema.find()
        .exec()
        .then((price) => res.json(price[0].tokenPrice))
        .catch(next)
}

export default {getTokenPrice}