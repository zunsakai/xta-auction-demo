import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import { ECollection } from '@app/modules/systems.mongodb/constants'

@Schema({ collection: ECollection.BIDS, timestamps: true, versionKey: false })
export class Bid {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ECollection.AUCTIONS, required: true })
  auctionId: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ECollection.USERS, required: true })
  userId: string

  @Prop({ type: Number, required: true })
  amount: number

  @Prop({ type: Date, default: Date.now })
  bidTime: Date
}

export type BidDocument = HydratedDocument<Bid>
export const BidSchema = SchemaFactory.createForClass(Bid)
