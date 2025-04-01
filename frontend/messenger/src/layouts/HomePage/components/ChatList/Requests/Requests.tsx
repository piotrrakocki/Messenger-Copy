import React, { useEffect, useState } from 'react';
import RequestsCSS from "./Requests.module.css";
import noMessageImg from "./../../../../../images/HomePage/Request.png";
import userCircleImg from "./../../../../../images/HomePage/user-circle.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { ChatOptionsPopup } from '../ChatList/ChatOptionPopup/ChatOptionsPopup';

export const Requests = () => {
    const [activeTab, setActiveTab] = useState<"mightKnow" | "spam">("mightKnow");
    const [activeChatSpam, setActiveChatSpam] = useState(1);
    const [activeChatRequest, setActiveChatRequest] = useState(1);
    const [settings, setSettings] = useState<number | null>(null);
    const [hoveredChat, setHoveredChat] = useState<number | null>(null);

    const spamData = [
        { id: 1, username: "User name", lastMessage: "Last text spam", lastTime: 1731014742161, img: "path/to/image1.jpg" },
        { id: 2, username: "User name", lastMessage: "Last text spam", lastTime: 1731014742161, img: "path/to/image2.jpg" },
    ];

    const requestData = [
        { id: 1, username: "User name", lastMessage: "Last text request", lastTime: 1731014742161, img: "path/to/image1.jpg" },
        { id: 2, username: "User name", lastMessage: "Last text request", lastTime: 1731014742161, img: "path/to/image2.jpg" },
    ];

    const handleSpamChatClick = (chatId: number) => {
        setActiveChatSpam(chatId);
    }

    const handleRequestChatClick = (chatId: number) => {
        setActiveChatRequest(chatId);
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
                !target.closest(`.${RequestsCSS.faEllipsisContainer}`) &&
                !target.closest(`.${RequestsCSS.popup}`)
            ) {
                setSettings(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [settings]);

    return (
        <div className={RequestsCSS.container}>
            <div className={RequestsCSS.headerContainer}>
                <div className={RequestsCSS.h1Container}>
                    <h1>Requests</h1>
                </div>
            </div>
            <div className={RequestsCSS.choiceContainer}>
                <div
                    className={`${RequestsCSS.textContainer} ${activeTab === "mightKnow" ? RequestsCSS.active : ""}`}
                    onClick={() => setActiveTab("mightKnow")}
                >
                    <span>You may know</span>
                </div>
                <div
                    className={`${RequestsCSS.textContainer} ${activeTab === "spam" ? RequestsCSS.active : ""}`}
                    onClick={() => setActiveTab("spam")}
                >
                    <span>Spam</span>
                </div>
            </div>
            {activeTab === "mightKnow" && (
                <>
                    {requestData.length === 0 ? (
                        <div className={RequestsCSS.noMessageContainer}>
                            <div className={RequestsCSS.imgContainer}>
                                <img src={noMessageImg} alt="request" />
                            </div>
                            <div className={RequestsCSS.noRequestContainer}>
                                <h4>No requests for consent to receive messages</h4>
                                <p>
                                    New requests for consent to receiving messages will be displayed here.
                                    You have the ability to control who can send you such requests.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={RequestsCSS.chatListContainer}>
                            {requestData.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`${RequestsCSS.chatContainer} ${activeChatRequest === chat.id ? RequestsCSS.activeChat : ""}`}
                                    onMouseEnter={() => setHoveredChat(chat.id)}
                                    onMouseLeave={() => setHoveredChat(null)}
                                    onClick={() => handleRequestChatClick(chat.id)}>
                                    <div className={RequestsCSS.userDetails}>
                                        <div className={RequestsCSS.imgUserCircleContainer}>
                                            <img src={userCircleImg} alt="user-circle" />
                                        </div>
                                        <div className={RequestsCSS.lastMessageContainer}>
                                            <span>{chat.username}</span>
                                            <div className={RequestsCSS.lastMessage}>
                                                <span>You: {chat.lastMessage}</span>
                                                <span> {formatTime(chat.lastTime)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {(hoveredChat === chat.id || settings === chat.id) && (
                                        <div
                                            className={RequestsCSS.faEllipsisContainer}
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
            )}
            {activeTab === "spam" && (
                <>
                    {spamData.length === 0 ? (
                        <div className={RequestsCSS.noMessageContainer}>
                            <div className={RequestsCSS.imgContainer}>
                                <img src={noMessageImg} alt="request" />
                            </div>
                            <div className={RequestsCSS.noRequestContainer}>
                                <h4>No spam received</h4>
                                <p>
                                    Any spam messages will appear here. You have control over who can send you messages.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={RequestsCSS.chatListContainer}>
                            {spamData.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`${RequestsCSS.chatContainer} ${activeChatSpam === chat.id ? RequestsCSS.activeChat : ""}`}
                                    onMouseEnter={() => setHoveredChat(chat.id)}
                                    onMouseLeave={() => setHoveredChat(null)}
                                    onClick={() => handleSpamChatClick(chat.id)}>
                                    <div className={RequestsCSS.userDetails}>
                                        <div className={RequestsCSS.imgUserCircleContainer}>
                                            <img src={userCircleImg} alt="user-circle" />
                                        </div>
                                        <div className={RequestsCSS.lastMessageContainer}>
                                            <span>{chat.username}</span>
                                            <div className={RequestsCSS.lastMessage}>
                                                <span>You: {chat.lastMessage}</span>
                                                <span> {formatTime(chat.lastTime)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {(hoveredChat === chat.id || settings === chat.id) && (
                                        <div
                                            className={RequestsCSS.faEllipsisContainer}
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
            )}
        </div>
    )
}