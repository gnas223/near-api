import { Request, Response, NextFunction } from 'express';
import liquidityVolume from '../models/liquidityVolume';

const get5mLiquidityVolume = (req: Request, res: Response, next: NextFunction) => {
    const pool_id: string = req.params.pool_id;

    liquidityVolume.find({pool_id: Number(pool_id)}).sort({ createdAt: -1 }).limit(72)
        .then((liquidity) => res.status(200).json(liquidity.reverse()))
        .catch(next)
}

const updateNewLiquidityVolume = async(req: Request, res: Response, next: NextFunction) => {
    const formData = req.body;
    const liquidityAmount = JSON.parse(formData.data);
    
    const amounts: Object = liquidityAmount.liquidity;
    const pool_id: number = liquidityAmount.pool_id;
    const liquidityDollar: string = liquidityAmount.liquidity_dollar;

    let lastestLiquidityVolume = await liquidityVolume.find({ pool_id }).sort({ createdAt: -1}).limit(1)

    if (lastestLiquidityVolume.length > 0) {
        let token1Volume
        let token2Volume
        let tokenId1
        let tokenId2
        if (Object.keys(lastestLiquidityVolume[0].liquidity)[0] === Object.keys(amounts)[0]) {
            
            tokenId1 = Object.keys(amounts)[0]
            tokenId2 = Object.keys(amounts)[1]

            token1Volume = Number(Object.values(lastestLiquidityVolume[0].liquidity)[0]) + Number(Object.values(amounts)[0])
            token2Volume = Number(Object.values(lastestLiquidityVolume[0].liquidity)[1]) + Number(Object.values(amounts)[1])
        } else {
            tokenId1 = Object.keys(amounts)[1]
            tokenId2 = Object.keys(amounts)[0]
            token1Volume = Number(Object.values(lastestLiquidityVolume[0].liquidity)[0]) + Number(Object.values(amounts)[1])
            token2Volume = Number(Object.values(lastestLiquidityVolume[0].liquidity)[1]) + Number(Object.values(amounts)[0])
        }

        let liquidity_dollar = Number(lastestLiquidityVolume[0].liquidity_dollar) || 0 + Number(liquidityDollar)
        

        liquidityVolume.findOneAndUpdate(
            { pool_id }, 
            { liquidity: { [tokenId1]: token1Volume.toString(), [tokenId2]: token2Volume.toString() }, liquidity_dollar }, 
            { sort: { createdAt: -1 }}
        )
            .then((liquidity) => res.status(200).json(liquidity))
            .catch(next)
    }

}

const get15mLiquidityVolume = async(req: Request, res: Response, next: NextFunction) => {
    const pool_id: string = req.params.pool_id;

    const _288Volume = await liquidityVolume.find({pool_id: Number(pool_id)}).sort({ createdAt: -1 }).limit(288)

    function groupArr(data: any[], n: number) {
        let group: any[][] = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i])
        }

        return group;
    }

    const groupVolume = groupArr(_288Volume, 3)

    let pool15mLiquidityVolume = []
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0)
        pool15mLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total4hVolume
        })
    }

    return res.status(200).json(pool15mLiquidityVolume.reverse())

}

const get30mLiquidityVolume = async(req: Request, res: Response, next: NextFunction) => {
    const pool_id: string = req.params.pool_id

    const _240Volume = await liquidityVolume.find({pool_id: Number(pool_id)}).sort({ createdAt: -1 }).limit(240)

    function groupArr(data: any[], n: number) {
        let group: any[][] = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i])
        }

        return group;
    }

    const groupVolume = groupArr(_240Volume, 6)

    let pool30mLiquidityVolume = []

    for(const volume of groupVolume) {
        const firstDatetime = volume[0].datetime
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0)
        pool30mLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total4hVolume
        })
    }


    return res.status(200).json(pool30mLiquidityVolume.reverse())
}

const get1hLiquidityVolume = async(req: Request, res: Response, next: NextFunction) => {
    const pool_id: string = req.params.pool_id

    const _576Volume = await liquidityVolume.find({pool_id: Number(pool_id)}).sort({ createdAt: -1 }).limit(576)

    function groupArr(data: any[], n: number) {
        let group: any[][] = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i])
        }

        return group;
    }

    const groupVolume = groupArr(_576Volume, 12)

    let pool1hLiquidityVolume = []

    for(const volume of groupVolume) {
        const firstDatetime = volume[0].datetime
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0)
        pool1hLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total4hVolume
        })
    }

    return res.status(200).json(pool1hLiquidityVolume.reverse())
}

const get4hLiquidityVolume = async (req: Request, res: Response, next: NextFunction) => {
    const pool_id: string = req.params.pool_id

    const _2016Volume =  await liquidityVolume.find({pool_id: Number(pool_id)}).sort({ createdAt: -1 }).limit(2016)

    function groupArr(data: any[], n: number) {
        let group: any[][] = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i])
        }

        return group;
    }

    const groupVolume = groupArr(_2016Volume, 48)
    let pool4hLiquidityVolume = []
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime
        const total4hVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0)
        pool4hLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total4hVolume
        })
    }

    return res.status(200).json(pool4hLiquidityVolume.reverse())

}

const get1dayLiquidityVolume = async(req: Request, res: Response, next: NextFunction) => {
    const pool_id: string = req.params.pool_id

    const _4032Volume =  await liquidityVolume.find({pool_id: Number(pool_id)}).sort({ createdAt: -1 }).limit(4032)

    function groupArr(data: any[], n: number) {
        let group: any[][] = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i])
        }

        return group;
    }

    const groupVolume = groupArr(_4032Volume, 288)
    let pool1dayLiquidityVolume = []
    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0)
        pool1dayLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total1dayVolume
        })
    }

    return res.status(200).json(pool1dayLiquidityVolume.reverse())
}

const get4daysLiquidityVolume = async(req: Request, res: Response, next: NextFunction) => {
    const pool_id: string = req.params.pool_id

    const _17280Volume = await liquidityVolume.find({pool_id: Number(pool_id)}).sort({ createdAt: -1 }).limit(17280)

    function groupArr(data: any[], n: number) {
        let group: any[][] = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i])
        }

        return group;
    }
    const groupVolume = groupArr(_17280Volume, 1152)
    let pool4daysLiquidityVolume = []

    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0)
        pool4daysLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total1dayVolume
        })
    }

    return res.status(200).json(pool4daysLiquidityVolume.reverse())

} 

const get7daysLiquidityVolume = async(req: Request, res: Response, next: NextFunction) => {
    const pool_id: string = req.params.pool_id

    const _30240Volume = await liquidityVolume.find({pool_id: Number(pool_id)}).sort({ createdAt: -1 }).limit(30240)

    function groupArr(data: any[], n: number) {
        let group: any[][] = [];
        for (let i = 0, j = 0; i < data.length; i++) {
            if (i >= n && i % n === 0)
                j++;
            group[j] = group[j] || [];
            group[j].push(data[i])
        }

        return group;
    }

    const groupVolume = groupArr(_30240Volume, 2016)

    let pool7daysLiquidityVolume = []

    for (const volume of groupVolume) {
        const firstDatetime = volume[0].datetime
        const total1dayVolume = volume.reduce((acc, item) => acc + Number(item.liquidity_dollar), 0)
        pool7daysLiquidityVolume.push({
            datetime: firstDatetime,
            liquidity_dollar: total1dayVolume
        })
    }

    return res.status(200).json(pool7daysLiquidityVolume.reverse())

}

const deleteAll = (req: Request, res: Response, next: NextFunction) => {
    liquidityVolume.deleteMany({})
        .exec()
        .then(() => res.status(200).json("delete all"))
        .catch(next)
}

export default { 
    get5mLiquidityVolume, 
    get15mLiquidityVolume,
    get30mLiquidityVolume,
    get1hLiquidityVolume,
    get4hLiquidityVolume, 
    get1dayLiquidityVolume,
    get4daysLiquidityVolume,
    get7daysLiquidityVolume,
    updateNewLiquidityVolume,
    deleteAll
}