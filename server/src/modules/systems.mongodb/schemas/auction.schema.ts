import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import { ECollection } from '@app/modules/systems.mongodb/constants'

@Schema({ collection: ECollection.AUCTIONS, timestamps: true, versionKey: false })
export class Auction {
  @Prop({ type: Number, default: 50 })
  startingPrice: number

  @Prop({ type: Number, default: 50 })
  currentPrice: number

  @Prop({ type: Number, default: 5 })
  minIncrement: number

  @Prop({ type: Date, required: true })
  startTime: Date

  @Prop({ type: Date, required: true })
  endTime: Date

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: ECollection.USERS }] })
  participants: string[]

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: ECollection.USERS })
  currentWinner: string
}

export type AuctionDocument = HydratedDocument<Auction>
export const AuctionSchema = SchemaFactory.createForClass(Auction)
