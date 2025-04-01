import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ECollection } from '@app/modules/systems.mongodb/constants'
import { BidDocument } from '@app/modules/systems.mongodb/schemas'
import { BaseRepository } from '@app/modules/systems.mongodb/repositories'

@Injectable()
export class BidRepository extends BaseRepository<BidDocument> {
  constructor(
    @InjectModel(ECollection.BIDS)
    protected readonly model: Model<BidDocument>
  ) {
    super(model)
  }
}
