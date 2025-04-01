import { EmojiDTO } from "./EmojiDTO";
import { ThemeDTO } from "./ThemeDTO";

export interface ConversationDTO {
    id: number;
    type: string;
    title: string;
    imageData: Uint8Array;
    theme: ThemeDTO;
    emoji: EmojiDTO;
    createdAt: string;
    updatedAt: string;
}