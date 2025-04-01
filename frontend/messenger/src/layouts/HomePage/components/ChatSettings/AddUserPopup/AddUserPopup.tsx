import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import AddUserPupupCSS from "./AddUserPopupCSS.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getToken } from "../../../../../utils/auth";
import { faMagnifyingGlass, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import { UserNameDTO } from "../../../../../types/UserNameDTO";
import userCircle from "./../../../../../images/HomePage/user-circle.png";
import { ConversationDTO } from "../../../../../types/ConversationDTO";
import { useConversation } from "../../../../../contexts/ConversationContext";
import { useParticipants } from "../../../../../contexts/ConversationParticipantContext";
import { ConversationParticipantDTO } from "../../../../../types/ConversationParticipantDTO";
import { MessageDTO } from "../../../../../types/MessageDTO ";

interface UserSettingsProps {
    onClose: () => void;
}

export const AddUserPopup: React.FC<UserSettingsProps> = ({ onClose }) => {
    const { conversation } = useConversation();
    const { participants, setParticipants } = useParticipants();
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const modalRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState<string>("");
    const [searchData, setSearchData] = useState<UserNameDTO[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserNameDTO[]>([]);
    const lastExecutedQueryRef = useRef<string>("");

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
    };

    const addParticipants = async () => {
        const message: MessageDTO = {
            content: `${selectedUser.map(u => `${u.firstName} ${u.lastName}`).join(', ')} has been added to the group.`,
            sentAt: new Date().toISOString(),
            conversationId: conversation?.id,
            senderId: 0, // Wypełniane na backendzie, można pominąć
            imageData: '',
            msgType: "SYSTEM",
            senderName: '', // Wypełniane na backendzie, można pominąć
        }
        const data = {
            messageDTO: message,
            userNameAndPictureDTOS: selectedUser
        }
        try {
            const response = await fetch(`${apiUrl}/v1/conversation-participant/${conversation?.id}/addParticipants`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const participantsResponse: ConversationParticipantDTO[] = await response.json();
            if (participants) {
                setParticipants([...participants, ...participantsResponse]);
            }
            onClose();
        } catch (err) {
            console.log(err);
        }
    }

    const handleCheckboxChange = (user: UserNameDTO, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedUser(prev => [...prev, user]);
        } else {
            setSelectedUser(prev => prev.filter(u => u.id !== user.id));
        }
    };

    const removeUser = (userId: number) => {
        setSelectedUser(prevUser => prevUser.filter(user => user.id !== userId));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.trim() !== lastExecutedQueryRef.current) {
            fetchUsers(newQuery);
        }
    };

    const convertToBase64 = (imageData: string | Uint8Array): string => {
        if (typeof imageData === 'string') {
            return `data:image/jpeg;base64,${imageData}`;
        }

        const binaryString = Array.from(imageData).map(byte => String.fromCharCode(byte)).join('');
        return `data:image/jpeg;base64,${btoa(binaryString)}`;
    };

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
        <div className={AddUserPupupCSS.overlay}>
            <div className={AddUserPupupCSS.modal} ref={modalRef}>
                <div className={AddUserPupupCSS.headerContainer}>
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className={AddUserPupupCSS.closeButton}
                    >
                        <FontAwesomeIcon icon={faXmark} style={{ color: "#fff" }} />
                    </button>
                    <h2>Add people</h2>
                </div>
                <div>
                    <div className={AddUserPupupCSS.searchContinaer}>
                        <div className={AddUserPupupCSS.searchIconContainer}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#939394", fontSize: "17px" }} />
                        </div>
                        <div className={AddUserPupupCSS.inputContainer}>
                            <input placeholder='Search' type="text" value={query} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
                <div className={AddUserPupupCSS.selectedUserListContainer}>
                    {selectedUser.length > 0 ? (
                        <div className={AddUserPupupCSS.selectedUserList}>
                            {selectedUser.map(user => (
                                <div
                                    className={AddUserPupupCSS.selectedUser}
                                    key={user.id}
                                >
                                    <div className={AddUserPupupCSS.imageContainer}>
                                        <img
                                            className={AddUserPupupCSS.profilePicture}
                                            src={user.imageData ? convertToBase64(user.imageData) : userCircle}
                                            alt="user-circle"
                                        />
                                        <FontAwesomeIcon
                                            className={AddUserPupupCSS.faXmark}
                                            icon={faXmark}
                                            onClick={() => removeUser(user.id)}
                                        />
                                    </div>
                                    <span className={AddUserPupupCSS.firstName}>
                                        {user.firstName}
                                    </span>
                                    <span className={AddUserPupupCSS.lastName}>
                                        {user.lastName}
                                    </span>
                                </div>

                            ))}
                        </div>
                    ) : (
                        <div className={AddUserPupupCSS.emptySelectedUsers}>
                            <p>No user selected</p>
                        </div>
                    )}
                </div>
                <div className={AddUserPupupCSS.usersListContainer}>
                    {searchData.map((user) => (
                        <label
                            key={user.id}
                            htmlFor={`customCheckbox-${user.id}`}
                            className={AddUserPupupCSS.userContainer}
                        >
                            <div className={AddUserPupupCSS.userDetails}>
                                <img
                                    src={user.imageData ? convertToBase64(user.imageData) : userCircle}
                                    alt="user-circle"
                                />
                                <h4>{user.firstName} {user.lastName}</h4>
                            </div>
                            <div className={AddUserPupupCSS.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    id={`customCheckbox-${user.id}`}
                                    onChange={(e) => handleCheckboxChange(user, e)}
                                    checked={selectedUser.some(selected => selected.id === user.id)}
                                />
                                <span className={AddUserPupupCSS.customCheckbox}>
                                    <FontAwesomeIcon icon={faCheck} className={AddUserPupupCSS.checkIcon} />
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
                <div className={AddUserPupupCSS.addPeopleBtnContainer}>
                    <button
                        className={AddUserPupupCSS.addPeopleBtn}
                        disabled={selectedUser.length === 0}
                        onClick={() => addParticipants()}
                    >
                        Add people
                    </button>
                </div>
            </div>
        </div>
    );
};