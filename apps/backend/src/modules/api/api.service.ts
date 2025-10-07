import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserAssetsPriceDto } from './dto/api.dto';
import * as ccxt from 'ccxt';

@Injectable()
export class ApiService {
    constructor(private prisma: PrismaService,) {}

    async updatePrices(data: UpdateUserAssetsPriceDto) {
        const exchange = new ccxt.bitget();// cex data source
        await exchange.loadMarkets();// est connection        
        
        const assets = await this.prisma.asset.findMany({
            where: {
                userId: data.userId,
            }
        });

        const filteredAssets = assets.map(item => ({
            symbol: `${item.symbol}/USDT`,
            geckoId: item.marketId,
            id: item.id
        }));

        const tickers = await exchange.fetchTickers();// get all tickers from exchange

        const ccxtPrices = {};// prices from ccxt
        const missingAssets: string[] = [];// asset for Gecko req

        for (const { symbol, geckoId } of filteredAssets) {
            if (tickers[symbol]) {
                ccxtPrices[geckoId] = tickers[symbol].last; // last price from cex
            } else {
                ccxtPrices[geckoId] = null; // if there no pair on cex
                missingAssets.push(geckoId)
            }
        }
        
        let geckoData: Record<string, { usd: number }> = {};
        if (missingAssets.length > 0) {
            missingAssets.push('tether')

            const url = `https://api.coingecko.com/api/v3/simple/price?ids=${missingAssets.join(',')}&vs_currencies=usd`;
            const res = await fetch(url);
            geckoData = await res.json();

            const tetherUsd = geckoData.tether?.usd ?? 1;

            for (const [key, value] of Object.entries(geckoData)) {
                geckoData[key].usd = value.usd / tetherUsd;
            }// convert usd prices to usdt
        }// get data from gecko

        const result = filteredAssets.map(asset => {
            let price = ccxtPrices[asset.geckoId];
            if (price == null) {
                price = geckoData[asset.geckoId]?.usd ?? null;
            }
            return { ...asset, price };
        });// create final data array

        const batchSize = 50;// optimal for sqlite
        for (let i = 0; i < result.length; i += batchSize) {
            const batch = result
                .slice(i, i + batchSize)
                .filter(asset => asset.price != null)
                .map(asset =>
                    this.prisma.asset.update({
                        where: { id: asset.id },
                        data: { price: asset.price },
                    }),
                );

            if (batch.length > 0) {
                await this.prisma.$transaction(batch);
            }
        }// batch price updater
    }

    async getCandleData() {
        const bitget = new ccxt.bitget({
            apiKey: process.env.BG_API_ACCESS,
            secret: process.env.BG_API_SECRET_KEY,
            password: process.env.BG_API_PASSWORD,
            enableRateLimit: true,
        });

        await bitget.loadMarkets();

        const symbol = 'BTC/USDT';
        const timeframe = '1m'; // 1 candle = 1 min
        const limit = 5; // last 5 candles

        // since period from
        const since = Date.now() - 5 * 60 * 1000; // last 5 min

        const candles = await bitget.fetchOHLCV(symbol, timeframe, since, limit) as Array<[number, number, number, number, number, number]>;

        console.log('--- BTC/USDT 1m candles ---');
        console.table(
            candles.map(([time, open, high, low, close, volume]) => ({
            time: new Date(time).toLocaleTimeString(),
            open,
            high,
            low,
            close,
            volume,
            }))
        );
    }
}
