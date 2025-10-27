import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSwapDto, GetSwapsDto, UpdateSwapDto } from './dto/swap.dto';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class SwapService {
    constructor(
        private prisma: PrismaService,
        private transaction: TransactionService,
    ) {}

    async createSwap(data: CreateSwapDto){
        const buyTransaction = await this.transaction.createTransaction({
            type: 'buy',
            assetId: data.assetIdReceive,
            timestamp: data.timestamp,
            quantity: data.receiveAmount,
            price: data.priceReceive,
            userId: data.userId,
            source: 'swap',
            fee: data.fee
        })

        const sellTransaction = await this.transaction.createTransaction({
            type: 'sell',
            assetId: data.assetIdChange,
            timestamp: data.timestamp,
            quantity: data.changeAmount,
            price: data.priceChange,
            userId: data.userId,
            source: 'swap'
        })

        const createSwap = await this.prisma.swaps.create({
            data: {
                assetIdChange: data.assetIdChange,
                assetIdReceive: data.assetIdReceive,
                fee: data.fee,
                notes: data.notes,
                changeAmount: data.changeAmount,
                receiveAmount: data.receiveAmount,
                priceChange: data.priceChange,
                priceReceive: data.priceReceive,
                userId: data.userId,
                timestamp: new Date(data.timestamp),
                sellTransactionId: sellTransaction.id,
                buyTransactionId: buyTransaction.id
            },
        });

        return createSwap
    }

    async getSwaps(data: GetSwapsDto){
        const swaps = await this.prisma.swaps.findMany({
                where: {
                    userId: data.userId,
                },
            });
        return swaps
    }

    async deleteSwap(swapId: string){
        const swap = await this.prisma.swaps.findFirst({
                where: {
                    id: swapId,
                },
            });

        await this.transaction.deleteTransactions(swap?.sellTransactionId as string);
        await this.transaction.deleteTransactions(swap?.buyTransactionId as string);

        await this.prisma.swaps.delete({
            where: { id: swapId },
        });

        return { message: 'Swap deleted' }
    }

    async updateSwap(data: UpdateSwapDto){
        const buyTransaction = await this.transaction.updateTransaction({
            type: 'buy',
            assetId: data.assetIdReceive,
            timestamp: data.timestamp,
            quantity: data.receiveAmount,
            price: data.priceReceive,
            userId: data.userId,
            source: 'swap',
            fee: data.fee,
            id: data.buyTransactionId
        })

        const sellTransaction = await this.transaction.updateTransaction({
            type: 'sell',
            assetId: data.assetIdChange,
            timestamp: data.timestamp,
            quantity: data.changeAmount,
            price: data.priceChange,
            userId: data.userId,
            source: 'swap',
            id: data.sellTransactionId
        })

        const createSwap = await this.prisma.swaps.update({
            where: {
                id: data.id,
            },
            data: {
                id: data.id,
                assetIdChange: data.assetIdChange,
                assetIdReceive: data.assetIdReceive,
                fee: data.fee,
                notes: data.notes,
                changeAmount: data.changeAmount,
                receiveAmount: data.receiveAmount,
                priceChange: data.priceChange,
                priceReceive: data.priceReceive,
                userId: data.userId
            },
        });

        return createSwap
    }
}
