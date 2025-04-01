export interface MessageDTO {
  id?: number;
  senderId: number;
  senderName: string;
  imageData: string;
  conversationId?: number;
  content: string;
  msgType: "CHAT" | "SYSTEM";
  sentAt: string;
}
