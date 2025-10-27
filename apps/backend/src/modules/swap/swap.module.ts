import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { SwapService } from './swap.service';
import { TransactionModule } from '../transaction/transaction.module';
import { SwapController } from './swap.controller';

@Module({
    imports: [PrismaModule, TransactionModule],
    controllers: [SwapController],
    providers: [SwapService],
})
export class SwapModule {}
