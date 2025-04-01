export interface ConversationParticipantDTO {
    id: number;
    userId: number;
    fullName: string;
    imageData: string;
    conversationId: number;
    nickname: string;
    joinedAt: Date;
    role: string;
    lastReadMessageId: number;
}