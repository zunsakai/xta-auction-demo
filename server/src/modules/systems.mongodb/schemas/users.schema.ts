import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ECollection } from '@app/modules/systems.mongodb/constants'
import { HydratedDocument } from 'mongoose'

@Schema({ collection: ECollection.USERS, timestamps: true, versionKey: false })
export class Users {
  @Prop({ type: String, required: true, unique: true })
  email: string

  @Prop({ type: String, required: true })
  password: string
}

export type UsersDocument = HydratedDocument<Users>
export const UsersSchema = SchemaFactory.createForClass(Users)
