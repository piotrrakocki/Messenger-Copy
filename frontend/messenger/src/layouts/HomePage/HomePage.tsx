import React, { useEffect, useState } from 'react';
import HomePageCSS from "./HomePage.module.css";
import { NavBar } from './components/NavBar/NavBar';
import { Chat } from './components/Chat/Chat';
import { ChatList } from './components/ChatList/ChatList/ChatList';
import { Marketplace } from './components/ChatList/Marketplace/Marketplace';
import { Archive } from './components/ChatList/Archive/Archive';
import { Requests } from './components/ChatList/Requests/Requests';
import { UserSettings } from './components/UserSettings/UserSettings';
import { ChatSettings } from './components/ChatSettings/ChatSettings';
import { getToken, isTokenExpired } from '../../utils/auth';
import { UserNameDTO } from '../../types/UserNameDTO';
import { ConversationDTO } from '../../types/ConversationDTO';

export const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
    const [activeIcon, setActiveIcon] = useState(1);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isChatSettingsOpen, setIsChatSettingsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserNameDTO | null>(null);
    const [conversationNotFound, setConversationNotFound] = useState<boolean>(false);
    const [conversation, setConversation] = useState<ConversationDTO | null>(null);

    const renderContent = () => {
        switch (activeIcon) {
            case 1:
                return <ChatList
                    onUserClick={(user) => setSelectedUser(user)}
                    onConversationStatusChange={(conversation) => setConversationNotFound(conversation)}
                    conversation={(conversation) => setConversation(conversation)}
                />;
            case 2:
                return <Marketplace />;
            case 3:
                return <Requests />;
            case 4:
                return <Archive />;
        }
    }

    const handleUserIconClick = () => {
        setIsSettingsOpen(true);
    }

    const closeSettings = () => {
        setIsSettingsOpen(false);
    }

    const handleEllipsisClick = () => {
        setIsChatSettingsOpen(prevState => !prevState);
    };

    useEffect(() => {
        const token = getToken();
        if (token && !isTokenExpired(token)) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <div className={HomePageCSS.container}>
            <NavBar
                activeIcon={activeIcon}
                setActiveIcon={setActiveIcon}
                onUserIconClick={handleUserIconClick}
            />
            {renderContent()}
            <div
                className={isChatSettingsOpen
                    ? HomePageCSS.chatGrid
                    : HomePageCSS.chatFlex
                }
            >
                <Chat
                    onEllipsisClick={handleEllipsisClick}
                    selectedUser={selectedUser}
                    conversationNotFound={conversationNotFound}
                    conversation={conversation}
                />
                {isChatSettingsOpen && <ChatSettings conversation={conversation} />}
            </div>
            {isSettingsOpen && <UserSettings onClose={closeSettings} />}
            {/* {isLoggedIn ? (
                <p>zalogowany</p>
            ) : (
                <p>nie zalogowany</p>
            )} */}
        </div>
    )
}