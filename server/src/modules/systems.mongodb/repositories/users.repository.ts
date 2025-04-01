import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ECollection } from '@app/modules/systems.mongodb/constants'
import { UsersDocument } from '@app/modules/systems.mongodb/schemas'
import { BaseRepository } from '@app/modules/systems.mongodb/repositories'

@Injectable()
export class UsersRepository extends BaseRepository<UsersDocument> {
  constructor(
    @InjectModel(ECollection.USERS)
    protected readonly model: Model<UsersDocument>
  ) {
    super(model)
  }
}
