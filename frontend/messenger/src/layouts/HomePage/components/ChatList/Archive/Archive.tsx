import React, { useEffect, useState } from 'react';
import ArchiveCSS from "./Archive.module.css";
import noMessageImg from "./../../../../../images/HomePage/Request.png";
import userCircleImg from "./../../../../../images/HomePage/user-circle.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { ChatOptionsPopup } from '../ChatList/ChatOptionPopup/ChatOptionsPopup';


export const Archive = () => {
    const [activeChatArchive, setActiveChatArchive] = useState(1);
    const [settings, setSettings] = useState<number | null>(null);
    const [hoveredChat, setHoveredChat] = useState<number | null>(null);

    const archivedData = [
        { id: 1, username: "User name", lastMessage: "Last text spam", lastTime: 1731014742161, img: "path/to/image1.jpg" },
        { id: 2, username: "User name", lastMessage: "Last text spam", lastTime: 1731014742161, img: "path/to/image2.jpg" },
    ];

    const handleArchiveChatClick = (chatId: number) => {
        setActiveChatArchive(chatId);
    }

    const handleSettingsClick = (id: number) => {
        setSettings(settings === id ? null : id);
    }

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const difference = now - timestamp;

        const minutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
        const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));

        if (years > 0) {
            return `${years}y`;
        } else if (months > 0) {
            return `${months}mo`;
        } else if (days > 0) {
            return `${days}d`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}min`;
        } else {
            return "";
        }
    };

    useEffect(() => {
        if (settings === null) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                !target.closest(`.${ArchiveCSS.faEllipsisContainer}`) &&
                !target.closest(`.${ArchiveCSS.popup}`)
            ) {
                setSettings(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [settings]);

    return (
        <div className={ArchiveCSS.container}>
            <div className={ArchiveCSS.headerContainer}>
                <div className={ArchiveCSS.h1Container}>
                    <h1>Archived chats</h1>
                </div>
            </div>
            <>
                {archivedData.length === 0 ? (
                    <div className={ArchiveCSS.noMessageContainer}>
                        <div className={ArchiveCSS.imgContainer}>
                            <img src={noMessageImg} alt="request" />
                        </div>
                        <div className={ArchiveCSS.noRequestContainer}>
                            <h4>No archived messages</h4>
                            <p>
                                Archived messages will appear here.
                                You have control over which messages are saved in your archive.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className={ArchiveCSS.chatListContainer}>
                        {archivedData.map((chat) => (
                            <div
                                key={chat.id}
                                className={`${ArchiveCSS.chatContainer} ${activeChatArchive === chat.id ? ArchiveCSS.activeChat : ""}`}
                                onMouseEnter={() => setHoveredChat(chat.id)}
                                onMouseLeave={() => setHoveredChat(null)}
                                onClick={() => handleArchiveChatClick(chat.id)}>
                                <div className={ArchiveCSS.userDetails}>
                                    <div className={ArchiveCSS.imgUserCircleContainer}>
                                        <img src={userCircleImg} alt="user-circle" />
                                    </div>
                                    <div className={ArchiveCSS.lastMessageContainer}>
                                        <span>{chat.username}</span>
                                        <div className={ArchiveCSS.lastMessage}>
                                            <span>You: {chat.lastMessage}</span>
                                            <span> {formatTime(chat.lastTime)}</span>
                                        </div>
                                    </div>
                                </div>
                                {(hoveredChat === chat.id || settings === chat.id) && (
                                    <div
                                        className={ArchiveCSS.faEllipsisContainer}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSettingsClick(chat.id);
                                        }}>
                                        <FontAwesomeIcon icon={faEllipsis} style={{ color: "#848484", fontSize: "15px" }} />
                                        {settings === chat.id && <ChatOptionsPopup isVisible={true} />}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </>
        </div>
    )
}