import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionService } from '../transaction/transaction.service';
import { CreateStakingDto, UpdateStakingDto } from './dto/staking.dto';
import { CreateTransactionDto } from '../transaction/dto/transaction.dto';

@Injectable()
export class StakingService {
    constructor(
        private prisma: PrismaService,
        private transaction: TransactionService,
    ) {}

    async createStaking(data: CreateStakingDto){
        const createStaking = await this.prisma.staking.create({
            data: {
                userId: data.userId,
                assetId: data.assetId,
                value: data.value,
                reward: data.reward,
                rewardSold: data.rewardSold,
                coinToReceive: data.coinToReceive,
                timestamp: new Date(data.timestamp),
                notes: data.notes,
                marks: data.marks,
            },
        });

        return createStaking
    }

    async updateStaking(data: UpdateStakingDto){
        const updateStaking = await this.prisma.staking.update({
            where: {
                id: data.id,
                userId: data.userId,
            },
            data: {
                value: data.value,
                reward: data.reward,
                rewardSold: data.rewardSold,
                notes: data.notes,
                marks: data.marks,
            },
        });

        return updateStaking
    }

    async sellReward(data: CreateTransactionDto){
        const sellTransaction = await this.transaction.createTransaction({
            type: 'sell',
            assetId: data.assetId,
            timestamp: data.timestamp,
            quantity: data.quantity,
            price: data.price,
            userId: data.userId,
            source: 'staking'
        })

        return sellTransaction
    }

    async getStakesByUser(id: string) {
        const staking = await this.prisma.staking.findMany({ where: { userId: id } });
        if (!staking) throw new NotFoundException('Note not found');

        return staking
    }

    async getStakingById(id: string) {
        const staking = await this.prisma.staking.findFirst({ where: { id } });
        if (!staking) throw new NotFoundException('Note not found');

        return staking
    }

    async deleteStaking(id: string){
        await this.prisma.staking.findFirst({ where: { id } });
        await this.prisma.staking.delete({ where: { id } });

        return { message: 'Staking deleted' }
    }
}
