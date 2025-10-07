import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AddItemToLibraryDto } from './dto/library.dto';
import axios from 'axios';

@Injectable()
export class LibraryService {
    constructor(private prisma: PrismaService,) {}

    async addItem(data: AddItemToLibraryDto) {
        const name = data.name
        const check = await this.prisma.library.findFirst({ where: { name } });

        if (check) {
            throw new BadRequestException('Item already exist');
        } else {
            return await this.prisma.library.create({
                data: {
                    name: data.name,
                    symbol: data.symbol,
                    geckoId: data.geckoId
                },
            });
        }
    }

    private async fetchAllCoins() {
        const url = 'https://api.coingecko.com/api/v3/coins/list';
        const { data } = await axios.get(url, {
            headers: { 'Accept-Encoding': 'identity' },
        });
        return data;
    }

    async syncAllCoins() {
        const allCoins = await this.fetchAllCoins();
        let addedCount = 0;

        const existing = await this.prisma.library.findMany({
            select: { geckoId: true },
        });// get ids from db
        const existingIds = new Set(existing.map((e) => e.geckoId));

        const newCoins = allCoins.filter((coin) => !existingIds.has(coin.id));//filter only new coins

        for (let i = 0; i < newCoins.length; i += 200) {
            const batch = newCoins.slice(i, i + 200);

            await this.prisma.library.createMany({// faster then upsert
                data: batch.map((coin) => ({
                    name: coin.name,
                    symbol: coin.symbol,
                    geckoId: coin.id,
                })),
            });

            addedCount += batch.length;
            console.log(`Add ${batch.length} assets (all ${addedCount})`);

            await new Promise((res) => setTimeout(res, 500));
        }// batch update

        return { message: `Sync finished. Added ${addedCount} assets` };
    }
}
