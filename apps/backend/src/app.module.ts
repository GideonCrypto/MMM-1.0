import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AssetModule } from './modules/asset/asset.module';
import { ApiModule } from './modules/api/api.module';
import { LibraryModule } from './modules/library/library.module';

@Module({
  imports: [
            UserModule,
            TransactionModule,
            AssetModule,
            ApiModule,
            LibraryModule,
          ],
  controllers: [],
  providers: [],
})
export class AppModule {}
