import React, { useEffect, useRef, useState } from 'react';
import ChangeThemePopupCSS from "./ChangeThemePopup.module.css"
import { faXmark, faCircleDot, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from '../../../../../utils/auth';
import { ThemeDTO } from '../../../../../types/ThemeDTO';
import { normalize } from 'path';
import { useConversation } from '../../../../../contexts/ConversationContext';
import { MessageDTO } from '../../../../../types/MessageDTO ';

interface UserSettingsProps {
    onClose: () => void;
}

export const ChangeThemePopup: React.FC<UserSettingsProps> = ({ onClose }) => {
    const { conversation, setConversation } = useConversation();
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const modalRef = useRef<HTMLDivElement>(null);
    const [isChanged, setIsChanged] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<ThemeDTO | undefined>(conversation?.theme);
    const [theme, setTheme] = useState<ThemeDTO[]>([]);

    const getAllTheme = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/theme/findAll`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data: ThemeDTO[] = await response.json();
            setTheme(data)
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    const changeTheme = async () => {
        const message: MessageDTO = {
            content: `Theme has been changed to ${selectedTheme?.name}`,
            sentAt: new Date().toISOString(),
            conversationId: conversation?.id,
            senderId: 0, // Wypełniane na backendzie, można pominąć
            imageData: '',
            msgType: "SYSTEM",
            senderName: '', // Wypełniane na backendzie, można pominąć
        }
        try {
            const response = await fetch(`${apiUrl}/v1/theme/${conversation?.id}/theme/${selectedTheme?.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`)
            }
            if (conversation && selectedTheme) {
                setConversation({
                    ...conversation,
                    theme: selectedTheme
                })
            }
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (conversation && selectedTheme) {
            setIsChanged(selectedTheme.id !== conversation.theme.id);
        }
    }, [selectedTheme, conversation]);

    useEffect(() => {
        getAllTheme();
    }, [])


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
        <div className={ChangeThemePopupCSS.overlay}>
            <div className={ChangeThemePopupCSS.modal} ref={modalRef}>
                <div className={ChangeThemePopupCSS.headerContainer}>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className={ChangeThemePopupCSS.closeButton}>
                        <FontAwesomeIcon icon={faXmark} style={{ color: "#fff" }} />
                    </button>
                    <h2>Change chat theme</h2>
                </div>
                <div className={ChangeThemePopupCSS.themeContainer}>
                    <div className={ChangeThemePopupCSS.themeListContainer}>
                        {theme.map((theme) => (
                            <div
                                key={theme.id}
                                className={ChangeThemePopupCSS.themeList}
                                onClick={() => setSelectedTheme(theme)}
                            >
                                <div className={ChangeThemePopupCSS.imageContainer}>
                                    {theme.imageData ? (
                                        <img src={`data:image/png;base64,${theme.imageData}`} alt="theme" />

                                    ) : (
                                        <FontAwesomeIcon
                                            className={ChangeThemePopupCSS.optionIcon}
                                            icon={faCircleDot}
                                            style={{
                                                color: theme.fontBackgroundColor,
                                                fontSize: "35px",
                                            }}
                                        />
                                    )}
                                </div>
                                <div className={ChangeThemePopupCSS.themeNameContainer}>
                                    <h4>{theme.name}</h4>
                                </div>
                                <div className={ChangeThemePopupCSS.faCheckContainer}>
                                    {selectedTheme?.id === theme.id && (
                                        <FontAwesomeIcon icon={faCheck} style={{ color: "#0084FF" }} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className={ChangeThemePopupCSS.chatContainer}
                        style={{
                            backgroundImage: selectedTheme && selectedTheme.imageData
                                ? `url(data:image/png;base64,${selectedTheme.imageData})`
                                : undefined,

                            backgroundColor: !selectedTheme || !selectedTheme.imageData
                                ? (selectedTheme ? selectedTheme.backgroundColor : "#1F1F1F")
                                : undefined,
                        }}
                    >
                        <div
                            className={`${ChangeThemePopupCSS.messageContainer} ${ChangeThemePopupCSS.myMessageContainer}`}
                            style={{
                                backgroundColor: selectedTheme ? selectedTheme.fontBackgroundColor : "#0084FF"
                            }}
                        >
                            <p>There are many themes to choose from, and each one is different.</p>
                        </div>
                        <div
                            className={`${ChangeThemePopupCSS.messageContainer} ${ChangeThemePopupCSS.myMessageContainer}`}
                            style={{
                                backgroundColor: selectedTheme ? selectedTheme.fontBackgroundColor : "#0084FF"
                            }}
                        >
                            <p>Messages sent to others will be in this color.</p>
                        </div>
                        <div className={ChangeThemePopupCSS.dateContainer}>
                            <span>14.02.2019, 21:41</span>
                        </div>
                        <div className={`${ChangeThemePopupCSS.messageContainer} ${ChangeThemePopupCSS.theirMessageContainer}`}>
                            <p>And messages from friends will look like this.</p>
                        </div>
                    </div>
                </div>
                <div className={ChangeThemePopupCSS.buttonContainer}>
                    <button
                        className={`${ChangeThemePopupCSS.cancleButton} ${ChangeThemePopupCSS.commonButton}`}
                        onClick={(e) => { e.stopPropagation(); onClose(); }}>
                        Cancel
                    </button>
                    <button
                        className={`${ChangeThemePopupCSS.saveButton} ${ChangeThemePopupCSS.commonButton} ${!isChanged ? ChangeThemePopupCSS.disabled : ""}`}
                        disabled={!isChanged}
                        onClick={() => changeTheme()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};