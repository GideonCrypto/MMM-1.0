import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AssetModule } from './modules/asset/asset.module';
import { ApiModule } from './modules/api/api.module';
import { LibraryModule } from './modules/library/library.module';
import { MarksModule } from './modules/marks/marks.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { NotesModule } from './modules/notes/notes.module';
import { SwapModule } from './modules/swap/swap.module';
import { StakingModule } from './modules/staking/staking.module';

@Module({
  imports: [
            UserModule,
            TransactionModule,
            AssetModule,
            ApiModule,
            LibraryModule,
            MarksModule,
            PortfolioModule,
            NotesModule,
            SwapModule,
            StakingModule,
          ],
  controllers: [],
  providers: [],
})
export class AppModule {}
