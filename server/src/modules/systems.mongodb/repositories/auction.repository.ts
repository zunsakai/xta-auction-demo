import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ECollection } from '@app/modules/systems.mongodb/constants'
import { AuctionDocument } from '@app/modules/systems.mongodb/schemas'
import { BaseRepository } from '@app/modules/systems.mongodb/repositories'

@Injectable()
export class AuctionRepository extends BaseRepository<AuctionDocument> {
  constructor(
    @InjectModel(ECollection.AUCTIONS)
    protected readonly model: Model<AuctionDocument>
  ) {
    super(model)
  }
}
