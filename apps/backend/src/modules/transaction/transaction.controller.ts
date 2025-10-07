import { Body, Controller, Delete, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateTransactionDto, GetTransactionDto, GetTransactionsDto } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
    constructor(private readonly service: TransactionService) {}

    @Post('createTransaction')
    @ApiOkResponse({
            description: 'Success',
            type: [CreateTransactionDto],
        })
    createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
        try {
            return this.service.createTransaction(createTransactionDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getTransaction')
    @ApiOkResponse({
            description: 'Success',
            type: [GetTransactionsDto],
        })
    getTransaction(@Body() getTransactionDto: GetTransactionDto) {
        try {
            return this.service.getTransaction(getTransactionDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Post('getTransactions')
    @ApiOkResponse({
            description: 'Success',
            type: [GetTransactionsDto],
        })
    getTransactions(@Body() getTransactionsDto: GetTransactionsDto) {
        try {
            return this.service.getTransactions(getTransactionsDto);
        } catch (error) {
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }

    @Delete(':transactionId')
    @ApiOkResponse({ description: 'Transaction deleted successfully' })
    async deleteTransaction(@Param('transactionId') transactionId: string) {
        try {
            const result = await this.service.deleteTransactions(transactionId);
            return result;
        } catch (error) {
            console.error('Delete transaction error:', error);
            throw new InternalServerErrorException('Unexpected error occurred');
        }
    }
}
