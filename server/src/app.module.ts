import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SystemMongoDBModule } from '@app/modules/systems.mongodb/systems.mongodb.module'
import { InitModule } from '@app/modules/init/init.module'
import { AuthModule } from '@app/modules/auth/auth.module'
import { AuctionModule } from '@app/modules/auction/auction.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SystemMongoDBModule,
    InitModule,
    AuthModule,
    AuctionModule,
  ],
})
export class AppModule {}
