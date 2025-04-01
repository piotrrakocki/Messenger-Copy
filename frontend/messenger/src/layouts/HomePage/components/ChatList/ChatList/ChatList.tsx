import React, { FC, useEffect, useRef, useState } from 'react';
import ChatListCSS from "./ChatList.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPenToSquare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import userCircle from "./../../../../../images/HomePage/user-circle.png";
import { getToken } from '../../../../../utils/auth';
import { UserNameDTO } from '../../../../../types/UserNameDTO';
import { ConversationDTO } from '../../../../../types/ConversationDTO';
import { useConversation } from '../../../../../contexts/ConversationContext';

interface ChatListProps {
    onUserClick: (user: UserNameDTO) => void;
    conversation: (conversation: ConversationDTO) => void;
    onConversationStatusChange: (isConversationFound: boolean) => void;
}

export const ChatList: FC<ChatListProps> = ({ onUserClick, onConversationStatusChange, conversation }) => {
    const { setConversation } = useConversation();
    const { conversation: globalConversation } = useConversation();
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [activeChat, setActiveChat] = useState<number | null>(null);
    const [settings, setSettings] = useState<number | null>(null);
    const [hoveredChat, setHoveredChat] = useState<number | null>(null);
    const [inputClick, setInputClick] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const lastExecutedQueryRef = useRef<string>("");
    const [searchData, setSearchData] = useState<UserNameDTO[]>([]);
    const [conversationNotFound, setConversationNotFound] = useState<boolean>(false);
    const [conversations, setConversations] = useState<ConversationDTO[]>([]);

    const convertToBase64 = (imageData: string | Uint8Array): string => {
        if (typeof imageData === 'string') {
            return `data:image/jpeg;base64,${imageData}`;
        }

        const binaryString = Array.from(imageData).map(byte => String.fromCharCode(byte)).join('');
        return `data:image/jpeg;base64,${btoa(binaryString)}`;
    };

    const chatData = { id: 1, username: "User name", lastMessage: "Last text", lastTime: 1731014742161, img: "path/to/image1.jpg" };

    const handleChatClick = (conversationId: number) => {
        const selectedConversation = conversations.find(c => c.id === conversationId);

        if (selectedConversation) {
            onConversationStatusChange(true);
            conversation(selectedConversation);
            setActiveChat(conversationId);
            setConversation(selectedConversation);
        } else {
            console.warn("Conversation not found for id:", conversationId);
        }
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

    const handleInputClick = () => {
        setInputClick(true);
    }

    const handleBackArrowClick = () => {
        setInputClick(false);
        setQuery("");
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.trim() !== lastExecutedQueryRef.current) {
            fetchUsers(newQuery);
        }
    }

    const handleUserClick = (user: UserNameDTO) => {
        fetchConversation(user.id);
        onUserClick(user);
    }

    const handleSendNewMessage = () => {
        onConversationStatusChange(false);
    }

    const fetchUsers = async (searchQuery: string) => {
        if (searchQuery.trim() === "") {
            setSearchData([]);
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/v1/user/search?query=${searchQuery}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.log("Error with fetch data from search");
            }

            const data: UserNameDTO[] = await response.json();
            setSearchData(data);

            lastExecutedQueryRef.current = searchQuery;
        } catch (e) {
            console.log(e);
        }
    }

    const fetchConversation = async (userId2: number) => {
        try {
            const response = await fetch(`${apiUrl}/v1/conversation/find?userId2=${userId2}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log("Conversation not found")
                    setConversationNotFound(false);
                    onConversationStatusChange(false);
                } else {
                    console.log("Error with fetching conversation.");
                }
                return;
            }
            const conversationData: ConversationDTO = await response.json();

            console.log("Fetched conversation:", conversation);
            setConversationNotFound(true);
            onConversationStatusChange(true);
            conversation(conversationData);
            setConversation(conversationData);

            return conversation;
        } catch (e) {
            console.log(e);
        }
    }

    const fetchConversations = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/conversation/findByUser`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: ConversationDTO[] = await response.json();
            setConversations(data);
            console.log("data: ", data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        const selectedConversation = conversations.find(c => c.id === conversations[0].id);

        if (conversations.length > 0) {
            setActiveChat(conversations[0].id);
            setConversation(conversations[0]);
            onConversationStatusChange(true);
            if (selectedConversation) {
                conversation(selectedConversation);
            }
        } else {
            setActiveChat(null);
        }
    }, [conversations]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (settings === null) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                !target.closest(`.${ChatListCSS.faEllipsisContainer}`) &&
                !target.closest(`.${ChatListCSS.popup}`)
            ) {
                setSettings(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [settings]);

    return (
        <div className={ChatListCSS.container}>
            <div className={ChatListCSS.headerContainer}>
                <div className={ChatListCSS.h1Container}>
                    <h1>Chat</h1>
                </div>
                <div onClick={handleSendNewMessage} className={ChatListCSS.iconContainer}>
                    <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#ffffff", fontSize: "20px" }} />
                </div>
            </div>
            <div className={ChatListCSS.searchBox}>
                {inputClick ? (
                    <div className={ChatListCSS.faArrowLeftContainer}>
                        <FontAwesomeIcon className={ChatListCSS.faPenToSquare} onClick={handleBackArrowClick} icon={faArrowLeft} style={{ color: "#939394", fontSize: "17px" }} />
                    </div>
                ) : (
                    <></>
                )}
                <div className={ChatListCSS.searchContinaer}>
                    <div className={ChatListCSS.searchIconContainer}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#939394", fontSize: "17px" }} />
                    </div>
                    <div className={ChatListCSS.inputContainer}>
                        <input placeholder='Search in Messenger' type="text" value={query} onClick={handleInputClick} onChange={handleInputChange} />
                    </div>
                </div>
            </div>
            {inputClick ? (
                <div className={ChatListCSS.chatListContainer}>
                    {searchData.map((user) => (
                        <div
                            key={user.id}
                            className={ChatListCSS.searchChatContainer}
                            onClick={() => handleUserClick(user)}
                        >
                            <div className={ChatListCSS.searchImgUserCircleContainer}>
                                <img src={user.imageData ? convertToBase64(user.imageData) : userCircle} alt="user-circle" />
                            </div>
                            <div className={ChatListCSS.userNameContainer}>
                                <span>{user.firstName} {user.lastName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={ChatListCSS.chatListContainer}>
                    {conversations ? (
                        <>
                            {conversations.map((conversation) => {
                                // Jeśli globalConversation jest ustawiona i jej id jest równe bieżącej rozmowie, używamy jej imageData
                                const selectedConversation =
                                    globalConversation && globalConversation.id === conversation.id
                                        ? globalConversation : conversation;
                                return (
                                    <div
                                        key={conversation.id}
                                        className={`${ChatListCSS.chatContainer} ${activeChat === conversation.id ? ChatListCSS.activeChat : ""
                                            }`}
                                        onMouseEnter={() => setHoveredChat(conversation.id)}
                                        onMouseLeave={() => setHoveredChat(null)}
                                        onClick={() => handleChatClick(conversation.id)}
                                    >
                                        <div className={ChatListCSS.userDetails}>
                                            <div className={ChatListCSS.imgUserCircleContainer}>
                                                <img src={selectedConversation.imageData ? convertToBase64(selectedConversation.imageData) : userCircle} alt="user-circle" />
                                            </div>
                                            <div className={ChatListCSS.lastMessageContainer}>
                                                <span>{globalConversation?.title && globalConversation.title.length > 25
                                                    ? globalConversation.title.slice(0, 25) + "..."
                                                    : globalConversation?.title}</span>
                                                <div className={ChatListCSS.lastMessage}>
                                                    <span>You: {chatData.lastMessage}</span>
                                                    <span>{formatTime(chatData.lastTime)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}