import React, { useEffect, useRef, useState } from "react";
import EmojiListPopupCSS from "./EmojiListPopupCSS.module.css"
import { getToken } from "../../../../../utils/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseball, faCar, faFaceSmile, faFlag, faIcons, faLightbulb, faMagnifyingGlass, faPaw, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { EmojiDTO } from "../../../../../types/EmojiDTO";

interface EmojiListPopupProps {
    onClose: () => void;
    onSelectEmoji: (emoji: string) => void;
}

export const EmojiListPopup: React.FC<EmojiListPopupProps> = ({ onClose, onSelectEmoji }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    const [emoji, setEmoji] = useState<EmojiDTO[]>([]);
    const [foundEmoji, setFoundEmoji] = useState<EmojiDTO[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const popupRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        getAllEmoji();
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className={EmojiListPopupCSS.popup} ref={popupRef}>
            <div className={EmojiListPopupCSS.modal}
            >
                <div className={EmojiListPopupCSS.searchContinaer}>
                    <div className={EmojiListPopupCSS.searchIconContainer}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#5F6061", fontSize: "14px" }} />
                    </div>
                    <div className={EmojiListPopupCSS.inputContainer}>
                        <input
                            placeholder='Search emoji'
                            type="text"
                            value={searchValue}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div className={EmojiListPopupCSS.emojiListContainer}>
                    {searchValue ? (
                        // Jeśli wpisano szukaną frazę, wyświetlamy przefiltrowane emoji
                        foundEmoji.length > 0 ? (
                            <div className={EmojiListPopupCSS.emojiList}>
                                {foundEmoji.map((emojiItem) => (
                                    <span
                                        key={emojiItem.id}
                                        className={EmojiListPopupCSS.emoji}
                                        onClick={() => onSelectEmoji(emojiItem.symbol)}
                                    >
                                        {emojiItem.symbol}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div>Nie znaleziono wyników</div>
                        )
                    ) : (
                        // Jeśli pole wyszukiwania jest puste, wyświetlamy emoji pogrupowane wg kategorii
                        emojiCategories.map((category) => (
                            <div key={category.id}>
                                <p id={category.id}>{category.label}</p>
                                <div className={EmojiListPopupCSS.emojiList}>
                                    {emoji
                                        .filter(category.filterFn)
                                        .map((emojiItem) => (
                                            <span
                                                key={emojiItem.id}
                                                className={EmojiListPopupCSS.emoji}
                                                onClick={() => onSelectEmoji(emojiItem.symbol)}
                                            >
                                                {emojiItem.symbol}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* <div className={EmojiListPopupCSS.emojiListContainer}>
                    {foundEmoji.length > 0 ? (
                        <>
                            {emojiCategories.map((category) => (
                                <div key={category.id}>
                                    <p id={category.id}>{category.label}</p>
                                    <div className={EmojiListPopupCSS.emojiList}>
                                        {emoji
                                            .filter(category.filterFn)
                                            .map((emojiItem) => (
                                                <span
                                                    key={emojiItem.id}
                                                    className={EmojiListPopupCSS.emoji}
                                                    onClick={() => {
                                                        onSelectEmoji(emojiItem.symbol);
                                                    }}
                                                >
                                                    {emojiItem.symbol}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {foundEmoji.map((emojiItem) => (
                                <span
                                    key={emojiItem.id}
                                    className={EmojiListPopupCSS.emoji}
                                    onClick={() => {
                                        onSelectEmoji(emojiItem.symbol)
                                    }}
                                >
                                    {emojiItem.symbol}
                                </span>
                            ))}
                        </>
                    )}
                </div> */}
                <div className={EmojiListPopupCSS.categoryContainer}>
                    <div className={EmojiListPopupCSS.iconContainer} onClick={() => scrollToCategory("smileys")}>
                        <FontAwesomeIcon icon={faFaceSmile} className={EmojiListPopupCSS.emojiIcon} />
                    </div>
                    <div className={EmojiListPopupCSS.iconContainer} onClick={() => scrollToCategory("animals")}>
                        <FontAwesomeIcon icon={faPaw} className={EmojiListPopupCSS.emojiIcon} />
                    </div>
                    <div className={EmojiListPopupCSS.iconContainer} onClick={() => scrollToCategory("food")}>
                        <FontAwesomeIcon icon={faUtensils} className={EmojiListPopupCSS.emojiIcon} />
                    </div>
                    <div className={EmojiListPopupCSS.iconContainer} onClick={() => scrollToCategory("activity")}>
                        <FontAwesomeIcon icon={faBaseball} className={EmojiListPopupCSS.emojiIcon} />
                    </div>
                    <div className={EmojiListPopupCSS.iconContainer} onClick={() => scrollToCategory("travel")}>
                        <FontAwesomeIcon icon={faCar} className={EmojiListPopupCSS.emojiIcon} />
                    </div>
                    <div className={EmojiListPopupCSS.iconContainer} onClick={() => scrollToCategory("objects")}>
                        <FontAwesomeIcon icon={faLightbulb} className={EmojiListPopupCSS.emojiIcon} />
                    </div>
                    <div className={EmojiListPopupCSS.iconContainer} onClick={() => scrollToCategory("symbols")}>
                        <FontAwesomeIcon icon={faIcons} className={EmojiListPopupCSS.emojiIcon} />
                    </div>
                    <div className={EmojiListPopupCSS.iconContainer} onClick={() => scrollToCategory("flags")}>
                        <FontAwesomeIcon icon={faFlag} className={EmojiListPopupCSS.emojiIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}