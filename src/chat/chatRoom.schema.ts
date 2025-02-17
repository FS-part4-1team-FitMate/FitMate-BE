import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ChatRoom extends Document {
  @Prop({ required: true, unique: true }) // 채팅방 ID
  roomId: string;

  @Prop({ required: true }) // 채팅을 먼저 시작한 유저
  participant1: string;

  @Prop({ required: true }) // 채팅 상대방
  participant2: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
