import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId | User;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  gender?: string;

  @Prop({ required: false })
  birthday?: Date;

  @Prop({ required: false })
  horoscope?: string;

  @Prop({ required: false })
  zodiac?: string;

  @Prop({ required: false })
  height?: number;

  @Prop({ required: false })
  weight?: number;

  @Prop({ type: [String], required: false, default: [] })
  interests: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
