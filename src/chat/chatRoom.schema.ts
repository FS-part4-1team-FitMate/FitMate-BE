import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatRoom extends Document {
  @Prop({ required: true, unique: true }) // 채팅방 ID
  roomId: string;

  @Prop({ required: true }) // 일반 유저 ID (PostgreSQL)
  userId: string;

  @Prop({ required: true }) // 트레이너 ID (PostgreSQL)
  trainerId: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
