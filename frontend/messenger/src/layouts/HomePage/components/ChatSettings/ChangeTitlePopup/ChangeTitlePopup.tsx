import React, { useEffect, useRef, useState } from 'react';
import ChangeTitlePopupCSS from "./ChangeTitlePopup.module.css"
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from '../../../../../utils/auth';
import { ConversationDTO } from '../../../../../types/ConversationDTO';
import { useConversation } from '../../../../../contexts/ConversationContext';
import { MessageDTO } from '../../../../../types/MessageDTO ';

interface UserSettingsProps {
    onClose: () => void;
    conversationDTO: ConversationDTO;
}

export const ChangeTitlePopup: React.FC<UserSettingsProps> = ({ onClose, conversationDTO }) => {
    const { conversation, setConversation } = useConversation();
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const modalRef = useRef<HTMLDivElement>(null);
    const [text, setText] = useState("");
    const [isChanged, setIsChanged] = useState(false);
    const maxLength = 50;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        setText(newText);
        setIsChanged(newText.trim() !== conversation?.title.trim());
    };

    const changeTitle = async (conversationId: number) => {
        let content;
        if (text === "") {
            content = `Group name has been removed.`;
        } else {
            content = `Group name has been changed to ${text}.`;
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
            newTitle: text
        }
        try {
            const response = await fetch(`${apiUrl}/v1/conversation/${conversationId}/title`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`)
            }
            const returnedTitle = await response.text();
            if (conversation) {
                setConversation({
                    ...conversation,
                    title: returnedTitle,
                });
            }
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (conversation) {
            setText(conversation?.title);
        }
    }, [conversation?.title]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();  // Zamykamy popup po kliknięciu poza nim
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
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className={ChangeTitlePopupCSS.closeButton}>
                        <FontAwesomeIcon icon={faXmark} style={{ color: "#fff" }} />
                    </button>
                    <h2>Change chat name</h2>
                </div>
                <div className={ChangeTitlePopupCSS.infoContainer}>
                    <p>Changing the name of a group chat will cause it to be changed for everyone.</p>
                </div>
                <div className={ChangeTitlePopupCSS.inputContainer}>
                    <span className={ChangeTitlePopupCSS.charCounter}>
                        {text.length}/{maxLength}
                    </span>
                    <input
                        className={ChangeTitlePopupCSS.titleInput}
                        type="text"
                        placeholder=" " // Potrzebne do efektu floating label
                        maxLength={maxLength}
                        value={text}
                        onChange={handleInputChange}
                    />
                    <label className={ChangeTitlePopupCSS.titleLabel}>Chat name</label>
                </div>

                <div className={ChangeTitlePopupCSS.buttonContainer}>
                    <button
                        className={`${ChangeTitlePopupCSS.cancleButton} ${ChangeTitlePopupCSS.commonButton}`}
                        onClick={(e) => { e.stopPropagation(); onClose(); }}>
                        Cancel
                    </button>
                    <button
                        className={`${ChangeTitlePopupCSS.saveButton} ${ChangeTitlePopupCSS.commonButton} ${!isChanged ? ChangeTitlePopupCSS.disabled : ""}`}
                        disabled={!isChanged}
                        onClick={() => changeTitle(conversationDTO.id)}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};