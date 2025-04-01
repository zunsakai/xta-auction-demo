import { Global, Module } from '@nestjs/common'
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose'
import { ECollection } from '@app/modules/systems.mongodb/constants'
import { UsersSchema, AuctionSchema, BidSchema } from '@app/modules/systems.mongodb/schemas'
import { UsersRepository, AuctionRepository, BidRepository } from '@app/modules/systems.mongodb/repositories'

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        let options: MongooseModuleFactoryOptions = {
          uri: `mongodb://admin:password@localhost:27017/`,
          dbName: 'xta-service',
          maxPoolSize: 1000,
        }
        return options
      },
    }),
    MongooseModule.forFeature([
      {
        name: ECollection.USERS,
        schema: UsersSchema,
      },
      {
        name: ECollection.AUCTIONS,
        schema: AuctionSchema,
      },
      {
        name: ECollection.BIDS,
        schema: BidSchema,
      },
    ]),
  ],
  providers: [UsersRepository, AuctionRepository, BidRepository],
  exports: [UsersRepository, AuctionRepository, BidRepository],
})
export class SystemMongoDBModule {}
