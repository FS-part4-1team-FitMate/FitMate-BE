export type ChatMessage = {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: Date;
  isRead?: boolean;
};
export type ChatMessageResponse = {
  senderId: string;
  senderNickname: string;
  senderProfileImage: string | null;
  message: string;
  createdAt: Date | null;
};
