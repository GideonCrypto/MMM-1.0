import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAssetDto, GetAssetDto, GetAssetsDto } from './dto/asset.dto';

@Injectable()
export class AssetService {
    constructor(private prisma: PrismaService,) {}

    async createAsset(data: CreateAssetDto){
        const check = await this.prisma.asset.findFirst({
            where: {
                name: data.name,
                userId: data.userId,
            }
        });

        if (check) {
            return 'Asset already exist'
        } else {
            return await this.prisma.asset.create({
                data: {
                    name: data.name,
                    symbol: data.symbol,
                    marketId: data.marketId,
                    userId: data.userId,
                    price: data.price,
                    timestamp: new Date(data.timestamp),
                    marks: null,
                    notes: null
                },
            });
        }
    }

    async getAsset(data: GetAssetDto){
        const asset = await this.prisma.asset.findFirst({
                where: {
                    id: data.assetId,
                    userId: data.userId,
                }
            });
        return asset
    }

    async getAssets(data: GetAssetsDto){
        const assets = await this.prisma.asset.findMany({
                where: {
                    userId: data.userId,
                }
        });
        return assets
    }

    async deleteAsset(assetId: string) {
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
        });

        if (!asset) {
            throw new NotFoundException('Asset not found');
        }

        await this.prisma.asset.delete({
            where: { id: assetId },
        });

        return { message: 'Asset deleted' };
    }
}
