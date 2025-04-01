import React from 'react';
import UserOptionsMenuCSS from "./UserOptionsMenuCSS.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faShield, faUserMinus, faBan, faComment } from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { ConversationParticipantDTO } from '../../../../types/ConversationParticipantDTO';
import { getToken, getUserIdFromToken } from '../../../../utils/auth';
import { useParticipants } from '../../../../contexts/ConversationParticipantContext';
import { useConversation } from '../../../../contexts/ConversationContext';
import { MessageDTO } from '../../../../types/MessageDTO ';

interface UserOptionsMenuProps {
    participant: ConversationParticipantDTO;
}

export const UserOptionsMenu: React.FC<UserOptionsMenuProps> = ({ participant }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    const { participants, setParticipants } = useParticipants();
    const { conversation } = useConversation();

    const changeRole = async (role: "ADMIN" | "MEMBER") => {
        try {
            const response = await fetch(`${apiUrl}/v1/conversation-participant/${conversation?.id}/${participant.id}/changeRole`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(role),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data: ConversationParticipantDTO = await response.json();
            if (participants !== null) {
                setParticipants(
                    participants.map(p => p.id === data.id ? data : p)
                );
            }
        } catch (err) {
            console.log(err);
        }
    }

    const deleteParticipant = async () => {
        const message: MessageDTO = {
            content: `${participant.fullName} has been removed.`,
            sentAt: new Date().toISOString(),
            conversationId: conversation?.id,
            senderId: 0, // Wypełniane na backendzie, można pominąć
            imageData: '',
            msgType: "SYSTEM",
            senderName: '', // Wypełniane na backendzie, można pominąć
        }
        try {
            const response = await fetch(`${apiUrl}/v1/conversation-participant/deleteParticipant/${conversation?.id}/${participant.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json",
                },
                body: JSON.stringify(message),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            console.log(response);
            if (participants !== null) {
                setParticipants(participants.filter(p => p.id !== participant.id));
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={UserOptionsMenuCSS.popup}>
            <div className={UserOptionsMenuCSS.settingsContainer}>
                {participant.id !== getUserIdFromToken() && (
                    <div
                        className={UserOptionsMenuCSS.optionContainer}
                    >
                        <div className={UserOptionsMenuCSS.customIconContainer}>
                            <FontAwesomeIcon icon={faComment} className={UserOptionsMenuCSS.customIcon} />
                        </div>
                        <p>Send message</p>
                    </div>
                )}
                <div
                    className={UserOptionsMenuCSS.optionContainer}
                >
                    <div className={UserOptionsMenuCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faFacebook} className={UserOptionsMenuCSS.customIcon} />
                    </div>
                    <p>See profile</p>
                </div>
                {participant.id !== getUserIdFromToken() && (
                    <div
                        className={UserOptionsMenuCSS.optionContainer}
                    >
                        <div className={UserOptionsMenuCSS.customIconContainer}>
                            <FontAwesomeIcon icon={faBan} className={UserOptionsMenuCSS.customIcon} />
                        </div>
                        <p>Block</p>
                    </div>
                )}
            </div>
            <hr />
            <div className={UserOptionsMenuCSS.settingsContainer}>
                {participant.id !== getUserIdFromToken() && participant.role === "MEMBER" && (
                    <div
                        className={UserOptionsMenuCSS.optionContainer}
                        onClick={() => changeRole("ADMIN")}
                    >
                        <div className={UserOptionsMenuCSS.customIconContainer}>
                            <FontAwesomeIcon icon={faShield} className={UserOptionsMenuCSS.customIcon} />
                        </div>
                        <p>Give administrator privileges</p>
                    </div>
                )}
                {participant.id !== getUserIdFromToken() && participant.role === "ADMIN" && (
                    <div
                        className={UserOptionsMenuCSS.optionContainer}
                        onClick={() => changeRole("MEMBER")}
                    >
                        <div className={UserOptionsMenuCSS.customIconContainer}>
                            <FontAwesomeIcon icon={faShield} className={UserOptionsMenuCSS.customIcon} />
                        </div>
                        <p>Revoke administrator privileges</p>
                    </div>
                )}
                {participant.id !== getUserIdFromToken() && participant.role === "MEMBER" && (
                    <div
                        className={UserOptionsMenuCSS.optionContainer}
                        onClick={() => deleteParticipant()}
                    >
                        <div className={UserOptionsMenuCSS.customIconContainer}>
                            <FontAwesomeIcon icon={faUserMinus} className={UserOptionsMenuCSS.customIcon} />
                        </div>
                        <p>Remove participant</p>
                    </div>
                )}
                {participant.id === getUserIdFromToken() && (
                    <div
                        className={UserOptionsMenuCSS.optionContainer}
                    >
                        <div className={UserOptionsMenuCSS.customIconContainer}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className={UserOptionsMenuCSS.customIcon} />
                        </div>
                        <p>Leave group</p>
                    </div>
                )}
            </div>
        </div>
    )
}
