import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTransactionDto, GetTransactionDto, GetTransactionsDto, UpdateTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
    constructor(private prisma: PrismaService) {}

    async createTransaction(data: CreateTransactionDto){
        return await this.prisma.transaction.create({
            data: {
                type: data.type,
                assetId: data.assetId,
                timestamp: new Date(data.timestamp),
                quantity: data.quantity,
                price: data.price,
                userId: data.userId,
                marks: null,
                notes: null,
                portfolio: null,
                source: data.source
            },
        });
    }

    async getTransaction(data: GetTransactionDto){
        const transactions = await this.prisma.transaction.findFirst({
                where: {
                    id: data.transactionId,
                    assetId: data.assetId,
                    userId: data.userId,
                },
            });
        return transactions
    }

    async getTransactions(data: GetTransactionsDto){
        const transactions = await this.prisma.transaction.findMany({
                where: {
                    assetId: data.assetId,
                    userId: data.userId,
                },
            });
        return transactions
    }

    async deleteTransactions(transactionId: string) {
        const asset = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!asset) {
            throw new NotFoundException('Transaction not found');
        }

        await this.prisma.transaction.delete({
            where: { id: transactionId },
        });

        return { message: 'Transaction deleted' };
    }

    async updateTransaction(data: UpdateTransactionDto) {
        const transaction = await this.prisma.transaction.update({
            where: {
                id: data.id,
            },
            data: {
                type: data.type,
                assetId: data.assetId,
                timestamp: new Date(data.timestamp),
                quantity: data.quantity,
                price: data.price,
                userId: data.userId,
                marks: null,
                notes: null,
                portfolio: null,
                source: data.source
            },
        });
        return transaction
    }
}
