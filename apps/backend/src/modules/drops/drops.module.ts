import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { TransactionModule } from '../transaction/transaction.module';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';

@Module({
    imports: [PrismaModule, TransactionModule],
    controllers: [DropsController],
    providers: [DropsService],
})
export class DropsModule {}
