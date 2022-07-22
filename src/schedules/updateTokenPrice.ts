import schedule from 'node-schedule';
import TokenPriceSchema from '../models/TokenPrice';
import axios from 'axios';
import tokenSymbol from '../assets/json/tokenSymbol.json';

interface TokenSymbols {
    wNEAR: string;
    USDC: string;
    USDT: string;
    DAI: string;
    WETH: string;
    "1INCH": string;
    GRT: string;
    SKYWARD: string;
    BANANA: string;
    CUCUMBER: string;
    HT: string;
    GTC: string;
    UNI: string;
    WBTC: string;
    LINK: string;
    OCT: string;
    REF: string;
    HAPI: string;
    PARAS: string;
    "1MIL": string;
    marmaj: string;
    STNEAR: string;
    Cheddar: string;
    PULSE: string;
    ETH: string;
    PXT: string;
    DBIO: string;
    AURORA: string;
    $META: string;
    POTATO: string;
    FLX: string;
    UMINT: string;
    nUSDO: string;
    OIN: string;
    MYRIA: string;
    xREF: string;
    SOL: string;
    UST: string;
    LUNA: string;
    CELO: string;
    cUSD: string;
    ABR: string;
    UTO: string;
    DEIP: string;
    WOO: string;
    LINEAR: string;
    USN: string;
    HBTC: string;
    PEM: string;
    ATO: string;
    SEAT: string;
}
  
const getNewTokenPrice = async() => {
    let usdPriceOfToken: {[key:string]: number} = {}

    const tokenSymbols: TokenSymbols = tokenSymbol
      
    const tokenIds: Array<string> = Object.keys(tokenSymbols)
    
    for (let i in tokenIds) {
        const key: string = tokenIds[i]
        
        const apiSymbol = tokenSymbols[key as keyof TokenSymbols]

        let tokenPrice: string | {[key: string]: number} = await axios({
            method: 'GET',
            url: `https://api.coingecko.com/api/v3/simple/price?ids=${apiSymbol}&vs_currencies=usd`
        })
        .then((res) => res.data)
        .catch(err => "0")

        if(!tokenPrice || Object.keys(tokenPrice).length === 0) tokenPrice = {[apiSymbol]: 0}

        usdPriceOfToken[key] = Object.values(tokenPrice)[0]?.usd?.toLocaleString('fullwide', {useGrouping: false}) || '0'
    }
        // console.log(usdPriceOfToken);
    
        return usdPriceOfToken
}

schedule.scheduleJob('*/5 * * * *', async function() {
    console.log("Token price has update new price");
    const tokenPrice = await getNewTokenPrice()
    
    await TokenPriceSchema.findOneAndUpdate({}, {tokenPrice}, {
        new: true,
        upsert: true
    })  
})
