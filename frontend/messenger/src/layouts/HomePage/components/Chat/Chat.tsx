import React, { FC, useEffect, useRef, useState } from 'react';
import { useInView } from "react-intersection-observer";
import ChatCSS from "./Chat.module.css";
import { faCirclePlus, faEllipsisH, faFaceSmile, faImage, faNoteSticky, faPhone, faThumbsUp, faVideo, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import userCircle from "./../../../../images/HomePage/user-circle.png";
import gif from "./../../../../images/HomePage/gif.png";
import { UserNameDTO } from '../../../../types/UserNameDTO';
import { UserListPopup } from './UserListPopup/UserListPopup';
import { getToken, getUserIdFromToken } from '../../../../utils/auth';
import { ConversationDTO } from '../../../../types/ConversationDTO';
import { MessageDTO } from '../../../../types/MessageDTO ';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { PaginatedResponse } from '../../../../types/PaginatedResponse';
import { useConversation } from '../../../../contexts/ConversationContext';
import { useParticipants } from '../../../../contexts/ConversationParticipantContext';
import { ConversationParticipantDTO } from '../../../../types/ConversationParticipantDTO';
import { EmojiListPopup } from './EmojiListPopup/EmojiListPopup';
import { ReadUpdateEvent } from '../../../../types/ReadUpdateEvent';
import { read } from 'fs';
import { MessageComponent } from './MessageComponent';

interface ChatProps {
    onEllipsisClick: () => void;
    selectedUser: UserNameDTO | null;
    conversationNotFound: boolean;
    conversation: ConversationDTO | null;
}

export const Chat: FC<ChatProps> = ({ onEllipsisClick, selectedUser, conversationNotFound, conversation }) => {
    const { conversation: globalConversation } = useConversation();
    const { participants, setParticipants } = useParticipants();
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [inputValue, setInputValue] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const lastExecutedQueryRef = useRef<string>("");
    const [query, setQuery] = useState<string>("");
    const [searchData, setSearchData] = useState<UserNameDTO[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserNameDTO[]>(() => {
        return !conversationNotFound && selectedUser ? [selectedUser] : [];
    });
    const [messages, setMessages] = useState<MessageDTO[]>([]);
    const [client, setClient] = useState<Client>();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [ref, inView] = useInView();
    const [isEmojiListPopup, setIEmojiListPopup] = useState<boolean>(false);

    const pageSize = 15;

    const [currentUserId, setCurrentUserId] = useState<number | null>();

    useEffect(() => {
        const id = getUserIdFromToken();
        participants?.map((participant) => {
            if (participant.userId === id) {
                setCurrentUserId(participant.id)
            }
        })
    }, [participants]);

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            onConnect: () => {
                console.log('Connected to WebSocket');

                const topic = `/topic/conversation/${conversation?.id}`;
                stompClient.subscribe(topic, (message) => {
                    console.log('Received message:', message.body);
                    const body = JSON.parse(message.body);
                    console.log("body ", body);
                    if (body.content !== undefined) {
                        const parsedMessage: MessageDTO = body;
                        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
                        chatContainerRef.current?.scrollTo({
                            top: chatContainerRef.current.scrollHeight,
                            behavior: 'smooth',
                        });
                    } else {
                        const readUpdate: ReadUpdateEvent = body;
                        console.log("we are here!!!")
                        if (participants) {
                            console.log('Before update:', participants);
                            setParticipants(
                                participants?.map((p) =>
                                    p.id === readUpdate.participantId
                                        ? { ...p, lastReadMessageId: readUpdate.lastReadMessageId }
                                        : p
                                )
                            );
                            console.log('Updated with readUpdate:', readUpdate);
                        }
                    }
                });
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, [conversation, token]);

    const sendMessage = () => {
        if (client && inputValue) {
            const message: MessageDTO = {
                content: inputValue,
                sentAt: new Date().toISOString(),
                conversationId: conversation?.id ?? undefined,
                senderId: 0, // Wypełniane na backendzie, można pominąć
                imageData: '',
                msgType: "CHAT",
                senderName: '', // Wypełniane na backendzie, można pominąć
            };

            client.publish({
                destination: '/app/sendMessage',
                body: JSON.stringify(message),
                headers: { Authorization: `Bearer ${token}` }
            });

            // console.log(message);

            setInputValue('');
        }
    }

    const handleMessageVisible = (messageId: number) => {
        const payload = {
            participantId: currentUserId,
            messageId: messageId
        }
        if (client && messageId > (participants?.find(p => p.id === currentUserId)?.lastReadMessageId || 0)) {
            client.publish({
                destination: `/app/conversation/${conversation?.id}/read`,
                body: JSON.stringify(payload),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json;charset=UTF-8'
                },
            })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.trim() !== lastExecutedQueryRef.current) {
            fetchUsers(newQuery);
        }
    }

    const handleUserSelect = (user: UserNameDTO) => {
        console.log('Selected user:', user);
        if (!selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
            setSelectedUsers(prevUsers => {
                console.log('Updated selectedUsers:', [...prevUsers, user]);
                return [...prevUsers, user];
            });
        }
    };

    const fetchMessages = async (page: number) => {
        const chatContainer = chatContainerRef.current;
        const scrollPosition = chatContainer?.scrollTop || 0;
        const scrollHeight = chatContainer?.scrollHeight || 0;
        try {
            const response = await fetch(
                `${apiUrl}/v1/message/conversation/${conversation?.id}?page=${page}&size=${pageSize}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: PaginatedResponse<MessageDTO> = await response.json();
            setMessages((prev) => [...data.content.reverse(), ...prev]);
            setTotalPages(data.totalPages);
            setCurrentPage(data.number);
            if (chatContainer) {
                const newScrollHeight = chatContainer.scrollHeight;
                chatContainer.scrollTop = newScrollHeight - scrollHeight + scrollPosition;
            }
            console.log("data: ", data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
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

    const handleCreateConversation = async () => {
        const payload = new FormData();
        payload.append("type", selectedUsers.length > 1 ? "GROUP" : "PRIVATE");
        payload.append("themeId", "1");
        payload.append("emojiId", "1");
        payload.append("userIds", selectedUsers.map(user => user.id).join(","));

        try {
            const response = await fetch(`${apiUrl}/v1/conversation/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: payload,
            });

            if (!response.ok) {
                console.log(`Error: ${response.statusText}`)
            }

            const data = await response.json();
            console.log("Conversation created successfully:", data);
        } catch (error) {
            console.log("Error creating conversation:", error)
        }
        window.location.reload();
    }

    const handleAction = async () => {
        if (!conversationNotFound) {
            await handleCreateConversation();
        }
        sendMessage();
    };

    const convertToBase64 = (imageData: string | Uint8Array): string => {
        if (typeof imageData === 'string') {
            return `data:image/jpeg;base64,${imageData}`;
        }

        const binaryString = Array.from(imageData).map(byte => String.fromCharCode(byte)).join('');
        return `data:image/jpeg;base64,${btoa(binaryString)}`;
    };

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

    const fetchParticipants = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/conversation-participant/${conversation?.id}`, {
                method: 'GET',
                headers: {
                    // 'Content-Type': 'application/json',
                    // 'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data: ConversationParticipantDTO[] = await response.json();
            setParticipants(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [conversation]);

    useEffect(() => {
        setMessages([]);
        setCurrentPage(0);
        setTotalPages(0);
        fetchMessages(0);
    }, [conversation?.id]);

    useEffect(() => {
        if (inView) {
            fetchMessages(currentPage + 1);
        }
    }, [inView]);

    useEffect(() => {
        if (!conversationNotFound && selectedUser && !selectedUsers.some(user => user.id === selectedUser.id)) {
            setSelectedUsers([selectedUser, ...selectedUsers]);
        }

        console.log("selectedUser: ", selectedUser)
    }, [selectedUser]);

    return (
        <div className={ChatCSS.container} style={{ backgroundColor: globalConversation?.theme.backgroundColor }}>
            <div className={ChatCSS.headerContainer}>
                {conversationNotFound ? (
                    <>
                        <div className={ChatCSS.userDetailsContainer}>
                            <div className={ChatCSS.imgContainer}>
                                <img src={globalConversation?.imageData
                                    ? convertToBase64(globalConversation.imageData)
                                    : userCircle
                                }
                                    alt="user-circle" />
                            </div>
                            <div className={ChatCSS.userDetails}>
                                <h5>{globalConversation?.title && globalConversation.title.length > 40
                                    ? globalConversation.title.slice(0, 40) + "..."
                                    : globalConversation?.title}</h5>
                                <span>Active 1h ago</span>
                            </div>
                        </div>
                        <div className={ChatCSS.headerIconsList}>
                            <div className={ChatCSS.headerIconsContainer}>
                                <FontAwesomeIcon className={ChatCSS.headerIcon} icon={faPhone} />
                            </div>
                            <div className={ChatCSS.headerIconsContainer}>
                                <FontAwesomeIcon className={ChatCSS.headerIcon} icon={faVideo} />
                            </div>
                            <div className={ChatCSS.headerIconsContainer} onClick={onEllipsisClick}>
                                <FontAwesomeIcon className={ChatCSS.headerIcon} icon={faEllipsisH} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={ChatCSS.usersToAddContainer}>
                            <span>To:</span>
                            {selectedUsers.map((user) => (
                                <div key={user.id} className={ChatCSS.usersToAdd}>
                                    <span>{user.firstName} {user.lastName}</span>
                                    <div
                                        className={ChatCSS.faXmarkContainer}
                                        onClick={() => setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id))}
                                    >
                                        <FontAwesomeIcon className={ChatCSS.faXmark} icon={faXmark} />
                                    </div>
                                </div>
                            ))}
                            <div className={ChatCSS.inputGroupMembers}>
                                <input
                                    type="text"
                                    onFocus={() => setIsVisible(true)}
                                    onBlur={() => setIsVisible(false)}
                                    onMouseDown={() => setIsVisible(true)}
                                    onChange={handleInputChange}
                                />
                                <div
                                    className={ChatCSS.userListPopupContainer}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <UserListPopup isVisible={isVisible} searchData={searchData} onUserSelect={handleUserSelect} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div ref={chatContainerRef} className={ChatCSS.chatContainer} style={{
                backgroundImage: globalConversation?.theme.imageData
                    ? `url(data:image/png;base64,${globalConversation.theme.imageData})`
                    : undefined,
            }}>
                <div>
                    {messages.map((msg, index) => (
                        <MessageComponent
                            key={msg.id}
                            msg={msg}
                            handleMessageVisible={handleMessageVisible}
                            index={index}
                            messages={messages}
                        />
                    ))}
                </div>
                {/* <div>
                    <div ref={ref}></div>
                    {messages.map((msg, index) => {
                        // const { ref, inView } = useInView({ threshold: 0.5 });

                        // useEffect(() => {
                        //     if (inView && msg.id !== undefined && msg.msgType === "CHAT") {
                        //         handleMessageVisible(msg.id);
                        //     }
                        // }, [inView, msg.id]);

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
                            conversation?.type == "GROUP";

                        const participant = participants?.find(p => p.id === msg.senderId);

                        const readers = participants?.filter(p => msg.id !== undefined && p.lastReadMessageId >= msg.id).map(p => p.nickname || p.fullName);

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
                                        {msg.senderId === currentUserId && readers && readers.length > 0 && (
                                            <div className={ChatCSS.readStatus}>
                                                Odczytane przez: {readers.join(', ')}
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
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div> */}
            </div>
            <div className={ChatCSS.messageContainer}>
                <div className={ChatCSS.iconsContainer}>
                    <div className={ChatCSS.iconContainer}>
                        <FontAwesomeIcon className={ChatCSS.footerIcon} icon={faCirclePlus} />
                    </div>
                    <div className={ChatCSS.iconContainer}>
                        <FontAwesomeIcon className={ChatCSS.footerIcon} icon={faImage} />
                    </div>
                    <div className={ChatCSS.iconContainer}>
                        <FontAwesomeIcon className={ChatCSS.footerIcon} icon={faNoteSticky} />
                    </div>
                    <div className={ChatCSS.iconContainer}>
                        <img src={gif} alt="gif" />
                    </div>
                </div>
                <div className={ChatCSS.sendMessageContainer}>
                    <div className={ChatCSS.inputContainer}>
                        <input
                            type="text"
                            value={inputValue || ""}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={
                                conversationNotFound
                                    ? "Send a message"
                                    : "Create conversation"
                            }
                        />
                    </div>
                    <div className={ChatCSS.iconContainer} onClick={() => setIEmojiListPopup(prev => !prev)}>
                        <FontAwesomeIcon className={ChatCSS.footerIcon} icon={faFaceSmile} />
                    </div>
                    {isEmojiListPopup && (
                        <div className={ChatCSS.popupContainer}>
                            <EmojiListPopup
                                onClose={() => setIEmojiListPopup(false)}
                                onSelectEmoji={(emoji) => { setInputValue(prev => prev + emoji) }}
                            />
                        </div>
                    )}
                </div>
                <div className={ChatCSS.figureContainer}>
                    <div className={ChatCSS.footerIconContainer}>
                        <>
                            {inputValue.trim() === "" ? (
                                <>
                                    <span className={ChatCSS.figure}>{globalConversation?.emoji.symbol}</span>
                                </>
                            ) : (
                                <svg onClick={handleAction} height="20px" viewBox="0 0 24 24" width="20px">
                                    <title>Press Enter to send</title>
                                    <path d="M16.69,12.47 L3.5,13.26 C3.19,13.26 3.03,13.42 3.03,13.57 L1.15,20.01 C0.83,20.8 0.99,21.89 1.77,22.52 C2.41,22.99 3.5,23.1 4.13,22.84 L21.71,14.04 C22.65,13.57 23.12,12.63 22.97,11.68 C22.81,11.06 22.34,10.43 21.71,10.12 L4.13,1.16 C3.34,0.9 2.4,1.0 1.77,1.47 C0.99,2.1 0.83,3.04 1.15,3.99 L3.03,10.43 C3.03,10.59 3.34,10.75 3.5,10.75 L16.69,11.53 C16.69,11.53 17.16,11.53 17.16,12.0 C17.16,12.47 16.69,12.47 16.69,12.47 Z" fill="#0080ff"></path>
                                </svg>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </div>
    )
}