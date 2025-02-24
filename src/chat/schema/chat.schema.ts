import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ required: true }) // 채팅방 ID
  roomId: string;

  @Prop({ required: true }) // 발신자 ID
  senderId: string;

  @Prop({ required: true }) // 메시지 내용
  message: string;

  @Prop({ default: false }) // 읽음 상태
  isRead: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
