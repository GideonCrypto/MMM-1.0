import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TransactionModule } from '../transaction/transaction.module';
import { StakingService } from './staking.service';
import { StakingController } from './staking.controller';

@Module({
    imports: [PrismaModule, TransactionModule],
    controllers: [StakingController],
    providers: [StakingService],
})
export class StakingModule {}
