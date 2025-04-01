import React, { useEffect, useRef, useState } from 'react';
import ChangeEmojiPopupCSS from "./ChangeEmojiIconPopup.module.css"
import { faXmark, faFaceSmile, faUtensils, faPaw, faBaseball, faCar, faLightbulb, faIcons, faFlag, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getToken } from '../../../../../utils/auth';
import { EmojiDTO } from '../../../../../types/EmojiDTO';
import { useConversation } from '../../../../../contexts/ConversationContext';
import { MessageDTO } from '../../../../../types/MessageDTO ';

interface UserSettingsProps {
    onClose: () => void;
}

export const ChangeEmojiIconPopup: React.FC<UserSettingsProps> = ({ onClose }) => {
    const { conversation, setConversation } = useConversation();
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const modalRef = useRef<HTMLDivElement>(null);
    const [emoji, setEmoji] = useState<EmojiDTO[]>([]);
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiDTO>();

    const [foundEmoji, setFoundEmoji] = useState<EmojiDTO[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");

    const emojiCategories = [
        {
            id: "smileys",
            label: "Smiles and People",
            filterFn: (emoji: { emojiCategory: string; }) =>
                emoji.emojiCategory === "SMILEYS" || emoji.emojiCategory === "PEOPLE",
        },
        {
            id: "animals",
            label: "Animals and nature",
            filterFn: (emoji: { emojiCategory: string; }) => emoji.emojiCategory === "ANIMALS_NATURE",
        },
        {
            id: "food",
            label: "Food and drinks",
            filterFn: (emoji: { emojiCategory: string; }) => emoji.emojiCategory === "FOOD_DRINK",
        },
        {
            id: "activity",
            label: "Activity",
            filterFn: (emoji: { emojiCategory: string; }) => emoji.emojiCategory === "ACTIVITY",
        },
        {
            id: "travel",
            label: "Travel and places",
            filterFn: (emoji: { emojiCategory: string; }) => emoji.emojiCategory === "TRAVEL_PLACES",
        },
        {
            id: "objects",
            label: "Items",
            filterFn: (emoji: { emojiCategory: string; }) => emoji.emojiCategory === "OBJECTS",
        },
        {
            id: "symbols",
            label: "Symbols",
            filterFn: (emoji: { emojiCategory: string; }) => emoji.emojiCategory === "SYMBOLS",
        },
        {
            id: "flags",
            label: "Flags",
            filterFn: (emoji: { emojiCategory: string; }) => emoji.emojiCategory === "FLAGS",
        },
    ]

    const scrollToCategory = (categoryId: string) => {
        const element = document.getElementById(categoryId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value.trim() === "") {
            setFoundEmoji([]);
        } else {
            const filtered = emoji.filter((item) =>
                item.description.toLowerCase().includes(value.toLowerCase())
            );
            setFoundEmoji(filtered);
        }
    };

    const getAllEmoji = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/emoji/findAll`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data: EmojiDTO[] = await response.json();
            setEmoji(data)
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    const changeEmoji = async (emoji: EmojiDTO) => {
        setSelectedEmoji(emoji);
        const message: MessageDTO = {
            content: `Emoji has been established on ${emoji.symbol}`,
            sentAt: new Date().toISOString(),
            conversationId: conversation?.id,
            senderId: 0, // Wypełniane na backendzie, można pominąć
            imageData: '',
            msgType: "SYSTEM",
            senderName: '', // Wypełniane na backendzie, można pominąć
        }
        try {
            const response = await fetch(`${apiUrl}/v1/emoji/${conversation?.id}/emoji/${emoji.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            if (emoji && conversation) {
                setConversation({
                    ...conversation,
                    emoji: emoji
                })
            }
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllEmoji();
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
        <div className={ChangeEmojiPopupCSS.overlay}>
            <div className={ChangeEmojiPopupCSS.modal} ref={modalRef}>
                <div className={ChangeEmojiPopupCSS.headerContainer}>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className={ChangeEmojiPopupCSS.closeButton}>
                        <FontAwesomeIcon icon={faXmark} style={{ color: "#fff" }} />
                    </button>
                    <h2>Change emoji icon</h2>
                </div>
                {conversation?.emoji.emojiCategory !== "DEFAULT" && (
                    <div className={ChangeEmojiPopupCSS.currentEmojiContainer}>
                        <div className={ChangeEmojiPopupCSS.EmojiContainer}>
                            <p>Current emojis</p>
                            <span className={ChangeEmojiPopupCSS.currentEmoji}>{conversation?.emoji.symbol}</span>
                        </div>
                        <div
                            className={ChangeEmojiPopupCSS.deleteContainer}
                            onClick={() => changeEmoji(emoji.find(e => e.emojiCategory === "DEFAULT")!)}
                        >
                            <FontAwesomeIcon icon={faXmark} style={{ color: "#fff" }} />
                            <p>Delete</p>
                        </div>
                    </div>
                )}
                <div className={ChangeEmojiPopupCSS.searchContinaer}>
                    <div className={ChangeEmojiPopupCSS.searchIconContainer}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#5F6061", fontSize: "14px" }} />
                    </div>
                    <div className={ChangeEmojiPopupCSS.inputContainer}>
                        <input
                            placeholder='Search emoji'
                            type="text"
                            value={searchValue}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div className={ChangeEmojiPopupCSS.emojiListContainer}>
                    {searchValue ? (
                        foundEmoji.length > 0 ? (
                            <div className={ChangeEmojiPopupCSS.emojiList}>
                                {foundEmoji.map((emojiItem) => (
                                    <span
                                        key={emojiItem.id}
                                        className={ChangeEmojiPopupCSS.emoji}
                                        onClick={() => changeEmoji(emojiItem)}
                                    >
                                        {emojiItem.symbol}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div>Nie znaleziono wyników</div>
                        )
                    ) : (
                        <>
                            {emojiCategories.map((category) => (
                                <div key={category.id}>
                                    <p id={category.id}>{category.label}</p>
                                    <div className={ChangeEmojiPopupCSS.emojiList}>
                                        {emoji
                                            .filter(category.filterFn)
                                            .map((emojiItem) => (
                                                <span
                                                    key={emojiItem.id}
                                                    className={ChangeEmojiPopupCSS.emoji}
                                                    onClick={() => changeEmoji(emojiItem)}
                                                >
                                                    {emojiItem.symbol}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className={ChangeEmojiPopupCSS.categoryContainer}>
                    <div className={ChangeEmojiPopupCSS.iconContainer} onClick={() => scrollToCategory("smileys")}>
                        <FontAwesomeIcon icon={faFaceSmile} className={ChangeEmojiPopupCSS.emojiIcon} />
                    </div>
                    <div className={ChangeEmojiPopupCSS.iconContainer} onClick={() => scrollToCategory("animals")}>
                        <FontAwesomeIcon icon={faPaw} className={ChangeEmojiPopupCSS.emojiIcon} />
                    </div>
                    <div className={ChangeEmojiPopupCSS.iconContainer} onClick={() => scrollToCategory("food")}>
                        <FontAwesomeIcon icon={faUtensils} className={ChangeEmojiPopupCSS.emojiIcon} />
                    </div>
                    <div className={ChangeEmojiPopupCSS.iconContainer} onClick={() => scrollToCategory("activity")}>
                        <FontAwesomeIcon icon={faBaseball} className={ChangeEmojiPopupCSS.emojiIcon} />
                    </div>
                    <div className={ChangeEmojiPopupCSS.iconContainer} onClick={() => scrollToCategory("travel")}>
                        <FontAwesomeIcon icon={faCar} className={ChangeEmojiPopupCSS.emojiIcon} />
                    </div>
                    <div className={ChangeEmojiPopupCSS.iconContainer} onClick={() => scrollToCategory("objects")}>
                        <FontAwesomeIcon icon={faLightbulb} className={ChangeEmojiPopupCSS.emojiIcon} />
                    </div>
                    <div className={ChangeEmojiPopupCSS.iconContainer} onClick={() => scrollToCategory("symbols")}>
                        <FontAwesomeIcon icon={faIcons} className={ChangeEmojiPopupCSS.emojiIcon} />
                    </div>
                    <div className={ChangeEmojiPopupCSS.iconContainer} onClick={() => scrollToCategory("flags")}>
                        <FontAwesomeIcon icon={faFlag} className={ChangeEmojiPopupCSS.emojiIcon} />
                    </div>
                </div>
            </div>
        </div>
    );
};