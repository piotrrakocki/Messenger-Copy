import React, { useEffect, useRef, useState } from 'react';
import ChangeTitlePopupCSS from "./EditNicknamePopup.module.css";
import { faXmark, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from '../../../../../utils/auth';
import { ConversationParticipantDTO } from '../../../../../types/ConversationParticipantDTO';
import userCircle from "./../../../../../images/HomePage/user-circle.png";
import { useParticipants } from '../../../../../contexts/ConversationParticipantContext';
import { MessageDTO } from '../../../../../types/MessageDTO ';
import { useConversation } from '../../../../../contexts/ConversationContext';

interface UserSettingsProps {
    onClose: () => void;
}

export const ChangeNicknamePopup: React.FC<UserSettingsProps> = ({ onClose }) => {
    const { participants, setParticipants } = useParticipants();
    const { conversation, setConversation } = useConversation();
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const modalRef = useRef<HTMLDivElement>(null);
    const [editingParticipantId, setEditingParticipantId] = useState<number>();
    const [nickname, setNickname] = useState("");

    const handleContainerClick = (participantId: number, currentNickname: string) => (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).tagName !== "INPUT") {
            setEditingParticipantId(participantId);
            setNickname(currentNickname);
        }
    };

    const handleConfirm = (participant: ConversationParticipantDTO) => (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        changeNickname(participant);
        setEditingParticipantId(-1);
    };

    const convertToBase64 = (imageData: string | Uint8Array): string => {
        if (typeof imageData === 'string') {
            return `data:image/jpeg;base64,${imageData}`;
        }
        const binaryString = Array.from(imageData).map(byte => String.fromCharCode(byte)).join('');
        return `data:image/jpeg;base64,${btoa(binaryString)}`;
    };

    const changeNickname = async (participant: ConversationParticipantDTO) => {
        let content;
        if (nickname === "") {
            content = `The nickname of user ${participant.fullName} has been removed.`;
        } else {
            content = `The nickname of user ${participant.fullName} has been set to ${nickname}.`;
        }
        const message: MessageDTO = {
            content: content,
            sentAt: new Date().toISOString(),
            conversationId: conversation?.id,
            senderId: 0, // Wypełniane na backendzie, można pominąć
            imageData: '',
            msgType: "SYSTEM",
            senderName: '', // Wypełniane na backendzie, można pominąć
        }
        const data = {
            messageDTO: message,
            nickname: nickname
        }
        try {
            const response = await fetch(`${apiUrl}/v1/conversation-participant/${participant.id}/nickname`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            if (participants) {
                const updateParticipants = participants.map(p =>
                    p.id === participant.id
                        ? { ...p, nickname: nickname }
                        : p
                );
                setParticipants(updateParticipants);
            }
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className={ChangeTitlePopupCSS.overlay}>
            <div className={ChangeTitlePopupCSS.modal} ref={modalRef}>
                <div className={ChangeTitlePopupCSS.headerContainer}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className={ChangeTitlePopupCSS.closeButton}
                    >
                        <FontAwesomeIcon icon={faXmark} style={{ color: "#fff" }} />
                    </button>
                    <h2>Change chat name</h2>
                </div>
                <div className={ChangeTitlePopupCSS.participantsList}>
                    {participants !== null && participants.map((participant) => (
                        <div
                            key={participant.id}
                            className={ChangeTitlePopupCSS.participantContainer}
                            onClick={handleContainerClick(participant.id, participant.nickname)}
                        >
                            {editingParticipantId === participant.id ? (
                                <>
                                    <div className={ChangeTitlePopupCSS.participantDetails}>
                                        <img
                                            src={
                                                participant.imageData
                                                    ? convertToBase64(participant.imageData)
                                                    : userCircle
                                            }
                                            alt="user-circle"
                                        />
                                        <input
                                            type="text"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                        />
                                    </div>
                                    <div
                                        className={ChangeTitlePopupCSS.iconContainer}
                                        onClick={handleConfirm(participant)}
                                    >
                                        <FontAwesomeIcon icon={faCheck} style={{ color: "#e4e6eb" }} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={ChangeTitlePopupCSS.participantDetails}>
                                        <img
                                            src={
                                                participant.imageData
                                                    ? convertToBase64(participant.imageData)
                                                    : userCircle
                                            }
                                            alt="user-circle"
                                        />
                                        <div className={ChangeTitlePopupCSS.participantName}>
                                            <h4>{participant.nickname !== null && participant.nickname !== "" ? participant.nickname : "Set nickname"}</h4>
                                            <p>{participant.fullName}</p>
                                        </div>
                                    </div>
                                    <div className={ChangeTitlePopupCSS.iconContainer}>
                                        <FontAwesomeIcon
                                            icon={faPen}
                                            style={{ color: "#e4e6eb", fontSize: "15px" }}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
