import { useInView } from "react-intersection-observer";
import ChatCSS from "./Chat.module.css";
import { MessageDTO } from "../../../../types/MessageDTO ";
import React, { useEffect, useState } from "react";
import { useConversation } from "../../../../contexts/ConversationContext";
import { useParticipants } from "../../../../contexts/ConversationParticipantContext";
import userCircle from "./../../../../images/HomePage/user-circle.png";
import { getUserIdFromToken } from "../../../../utils/auth";

interface MessageComponentProps {
    msg: MessageDTO;
    index: number;
    messages: MessageDTO[];
    handleMessageVisible: (messageId: number) => void;
}

export const MessageComponent: React.FC<MessageComponentProps> = ({ msg, index, messages, handleMessageVisible }) => {
    const { ref, inView } = useInView({ threshold: 0.5 });
    const [currentUserId, setCurrentUserId] = useState<number | null>();
    const { conversation: globalConversation } = useConversation();
    const { participants, setParticipants } = useParticipants();

    useEffect(() => {
        if (inView && msg.id !== undefined && msg.msgType === "CHAT") {
            handleMessageVisible(msg.id);
        }
    }, [inView, msg.id, handleMessageVisible]);

    const prevMessageTime = index > 0 ? new Date(messages[index - 1].sentAt).getTime() : null;
    const currentMessageTime = new Date(msg.sentAt).getTime();
    const nextMessageTime = index < messages.length - 1 ? new Date(messages[index + 1].sentAt).getTime() : null;

    const showTime =
        !prevMessageTime || (currentMessageTime - prevMessageTime) / (1000 * 60) > 15;

    const isLastInGroup =
        index === messages.length - 1 ||
        messages[index + 1].msgType !== "CHAT" ||
        messages[index + 1].senderId !== msg.senderId;

    const showAvatar =
        (isLastInGroup ||
            (nextMessageTime && (nextMessageTime - currentMessageTime) / (1000 * 60) > 15));

    const showSenderName =
        msg.senderId !== currentUserId &&
        (index === 0 ||
            messages[index - 1]?.senderId !== msg.senderId ||
            (prevMessageTime && (currentMessageTime - prevMessageTime) / (1000 * 60) > 15)) &&
        globalConversation?.type == "GROUP";

    const participant = participants?.find(p => p.id === msg.senderId);

    const safeParticipants = participants ?? [];

    const readersForMessage = safeParticipants.filter(
        p => msg.id !== undefined && p.lastReadMessageId === msg.id
    );

    const formatMessageDate = (sentAt: string | Date): string => {
        const currentDate = new Date();
        const messageDate = new Date(sentAt);

        // Różnica w dniach między obecną datą a datą wiadomości
        const diffInDays = Math.floor(
            (currentDate.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Sprawdzenie, czy rok wiadomości różni się od bieżącego
        const isDifferentYear = messageDate.getFullYear() !== currentDate.getFullYear();

        // Jeśli wiadomość jest starsza niż tydzień, pokaż datę
        if (diffInDays > 7) {
            return messageDate.toLocaleDateString('pl-PL', {
                day: 'numeric',
                month: 'long',
                ...(isDifferentYear && { year: 'numeric' }), // Dodaj rok, jeśli jest inny
                hour: '2-digit',
                minute: '2-digit',
            });
        }

        // Nowsze wiadomości pokazują dzień tygodnia z godziną i minutami
        return messageDate.toLocaleDateString('pl-PL', {
            weekday: 'short', // Skrócony dzień tygodnia (np. "pon.")
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const convertToBase64 = (imageData: string | Uint8Array): string => {
        if (typeof imageData === 'string') {
            return `data:image/jpeg;base64,${imageData}`;
        }

        const binaryString = Array.from(imageData).map(byte => String.fromCharCode(byte)).join('');
        return `data:image/jpeg;base64,${btoa(binaryString)}`;
    };

    useEffect(() => {
        const id = getUserIdFromToken();
        participants?.map((participant) => {
            if (participant.userId === id) {
                setCurrentUserId(participant.id)
            }
        })
    }, [participants]);

    return (
        <div key={msg.id} ref={ref} className={ChatCSS.messageWrapper}>
            {msg.msgType === "SYSTEM" && (
                <div className={ChatCSS.timeSeparator}>
                    {msg.msgType === "SYSTEM" && msg.content}
                </div>
            )}
            {msg.msgType === "CHAT" && (
                <>
                    {showTime && (
                        <div className={ChatCSS.timeSeparator}>
                            {formatMessageDate(msg.sentAt)}
                        </div>
                    )}
                    {showSenderName && (
                        <div className={ChatCSS.senderName}>
                            <div>
                                <span>{participant?.nickname || participant?.fullName}</span>
                            </div>
                        </div>
                    )}
                    <div className={ChatCSS.messageWithAvatar}>
                        <div className={ChatCSS.avatarPlaceholder}>
                            {msg.senderId !== currentUserId && showAvatar && (
                                <img src={msg.imageData
                                    ? convertToBase64(msg.imageData)
                                    : userCircle
                                } alt="userCircle" className={ChatCSS.userAvatar} />
                            )}
                        </div>
                        <div
                            className={`${ChatCSS.message} ${msg.senderId === currentUserId
                                ? ChatCSS.mine
                                : ChatCSS.theirs
                                }`}
                            style={msg.senderId === currentUserId ? { backgroundColor: globalConversation?.theme.fontBackgroundColor } : {}}
                        >
                            {msg.content}
                            <div className={ChatCSS.sentAt}>
                                {formatMessageDate(msg.sentAt)}
                            </div>
                        </div>
                    </div>
                    {readersForMessage && readersForMessage.length > 0 && (
                        <div className={ChatCSS.readStatus}>
                            {readersForMessage.map(r => (
                                <div className={ChatCSS.readerImgContainer}>
                                    <img src={r.imageData
                                        ? convertToBase64(r.imageData)
                                        : userCircle
                                    } alt="userCircle"
                                        className={ChatCSS.readerImg}
                                        title={r.nickname || r.fullName}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};