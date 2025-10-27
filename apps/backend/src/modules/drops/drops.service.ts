import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionService } from '../transaction/transaction.service';
import { CreateTransactionDto } from '../transaction/dto/transaction.dto';
import { CreateDropDto, UpdateDropDto } from './dto/drops.dto';

@Injectable()
export class DropsService {
    constructor(
        private prisma: PrismaService,
        private transaction: TransactionService,
    ) {}

    async createDrop(data: CreateDropDto){
        const createDrop = await this.prisma.drops.create({
            data: {
                userId: data.userId,
                assetId: data.assetId,
                fee: data.fee,
                timestamp: new Date(data.timestamp),
                notes: data.notes,
                marks: data.marks,
                value: data.value,
                sold: data.sold,
                price: data.price,
                transactions: data.transactions,
            },
        });

        return createDrop
    }

    async sellReward(data: CreateTransactionDto){
        const sellTransaction = await this.transaction.createTransaction({
            type: 'sell',
            assetId: data.assetId,
            timestamp: data.timestamp,
            quantity: data.quantity,
            price: data.price,
            userId: data.userId,
            source: 'drop'
        })

        return sellTransaction
    }

    async updateDrop(data: UpdateDropDto){
        const updateDrop = await this.prisma.drops.update({
            where: {
                id: data.id,
                userId: data.userId,
            },
            data: {
                userId: data.userId,
                assetId: data.assetId,
                fee: data.fee,
                notes: data.notes,
                marks: data.marks,
                value: data.value,
                sold: data.sold,
                price: data.price,
                transactions: data.transactions,
            },
        });

        return updateDrop
    }

    async getDropsByUser(id: string) {
        const drop = await this.prisma.drops.findMany({ where: { userId: id } });
        if (!drop) throw new NotFoundException('Note not found');

        return drop
    }

    async getDropById(id: string) {
        const drop = await this.prisma.drops.findFirst({ where: { id } });
        if (!drop) throw new NotFoundException('Note not found');

        return drop
    }

    async deleteDrop(id: string){
        await this.prisma.drops.findFirst({ where: { id } });
        await this.prisma.drops.delete({ where: { id } });

        return { message: 'Drop deleted' }
    }
}
