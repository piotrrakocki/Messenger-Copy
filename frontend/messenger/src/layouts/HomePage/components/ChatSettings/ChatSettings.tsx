import React, { FC, useEffect, useRef, useState } from 'react';
import ChatSettingsCSS from "./ChatSettings.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faAngleDown, faAngleRight, faBan, faBell, faCircleDot, faMagnifyingGlass, faThumbsUp, faThumbtack, faTriangleExclamation, faPen, faImage, faEllipsis, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import userCircle from "./../../../../images/HomePage/user-circle.png";
import { ConversationDTO } from '../../../../types/ConversationDTO';
import { ConversationParticipantDTO } from '../../../../types/ConversationParticipantDTO';
import { getToken, getUserIdFromToken } from '../../../../utils/auth';
import { ChangeTitlePopup } from './ChangeTitlePopup/ChangeTitlePopup';
import { ChangeThemePopup } from './ChangeThemePopup/ChangeThemePopup';
import { ChangeEmojiIconPopup } from './ChangeEmojiIconPopup/ChangeEmojiIconPopup';
import { ChangeNicknamePopup } from './EditNicknamePopup/EditNicknamePopup';
import { useConversation } from '../../../../contexts/ConversationContext';
import { useParticipants } from '../../../../contexts/ConversationParticipantContext';
import { AddUserPopup } from './AddUserPopup/AddUserPopup';
import { UserOptionsMenu } from './UserOptionsMenu';
import { MessageDTO } from '../../../../types/MessageDTO ';

interface ChatSettingsProps {
    conversation: ConversationDTO | null;
}

export const ChatSettings: FC<ChatSettingsProps> = ({ conversation }) => {
    const { participants, setParticipants } = useParticipants();
    const { conversation: globalConversation, setConversation } = useConversation();
    const [openPopup, setOpenPopup] = useState<string>('');
    const apiUrl = process.env.REACT_APP_API_URL;
    const token = getToken();
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [activeUserId, setActiveUserId] = useState<number | null>(null);

    const popupRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                userIconRef.current !== event.target
            ) {
                setPopupVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const togglePopup = (userId: number | null) => {
        setActiveUserId((prevId) => (prevId === userId ? null : userId));
    };

    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        chatInformation: false,
        customizeChat: false,
        chatMembers: false,
        multimediaFiles: false,
        privacySupport: false,
    })
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            changeImageData(file);
        }
    };

    const handleOpenPopup = (popupName: string) => {
        setOpenPopup(popupName);
    };

    const handleClosePopup = () => {
        setOpenPopup("");
    };

    const toggleCollapse = (sectionName: string) => {
        setOpenSections(prevState => ({
            ...prevState,
            [sectionName]: !prevState[sectionName]
        }));
    };



    const convertToBase64 = (imageData: string | Uint8Array): string => {
        if (typeof imageData === 'string') {
            return `data:image/jpeg;base64,${imageData}`;
        }

        const binaryString = Array.from(imageData).map(byte => String.fromCharCode(byte)).join('');
        return `data:image/jpeg;base64,${btoa(binaryString)}`;
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

    const changeImageData = async (file: File) => {
        const fileBuffer = await file.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(fileBuffer));
        const message: MessageDTO = {
            content: `The group photo has been changed.`,
            sentAt: new Date().toISOString(),
            conversationId: conversation?.id,
            senderId: 0, // Wypełniane na backendzie, można pominąć
            imageData: '',
            msgType: "SYSTEM",
            senderName: '', // Wypełniane na backendzie, można pominąć
        }
        const data = {
            messageDTO: message,
            imageData: imageArray
        }
        try {
            const response = await fetch(`${apiUrl}/v1/conversation/${globalConversation?.id}/imageData`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const uploadediImageData = new Uint8Array(fileBuffer);
            if (globalConversation) {
                setConversation({
                    ...globalConversation,
                    imageData: uploadediImageData,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        fetchParticipants();
    }, [conversation]);

    if (!conversation) {
        return (
            <div className={ChatSettingsCSS.container}>
                <p>Wybierz użytkownika z listy...</p>
            </div>
        );
    }

    return (
        <div className={ChatSettingsCSS.container}>
            <div className={ChatSettingsCSS.headerContainer}>
                <div className={ChatSettingsCSS.imgContainer}>
                    <img src={globalConversation?.imageData
                        ? convertToBase64(globalConversation.imageData)
                        : userCircle
                    } alt="user-circle" />
                    <h3>{globalConversation?.title && globalConversation.title.length > 30
                        ? globalConversation.title.slice(0, 30) + "..."
                        : globalConversation?.title}</h3>
                    <span>Activ 1 h ago</span>
                </div>
                <div className={ChatSettingsCSS.gropuIconContainer}>
                    <div className={ChatSettingsCSS.headerListIconContainer}>
                        <div className={ChatSettingsCSS.headerIconContainer}>
                            <FontAwesomeIcon className={ChatSettingsCSS.headerIcon} icon={faFacebook} />
                        </div>
                        <span>Profil</span>
                    </div>
                    <div className={ChatSettingsCSS.headerListIconContainer}>
                        <div className={ChatSettingsCSS.headerIconContainer}>
                            <FontAwesomeIcon className={ChatSettingsCSS.headerIcon} icon={faBell} />
                        </div>
                        <span>Mute</span>
                    </div>
                    <div className={ChatSettingsCSS.headerListIconContainer}>
                        <div className={ChatSettingsCSS.headerIconContainer}>
                            <FontAwesomeIcon className={ChatSettingsCSS.headerIcon} icon={faMagnifyingGlass} />
                        </div>
                        <span>Search</span>
                    </div>
                </div>
            </div>
            <div className={ChatSettingsCSS.listSettingsContainer}>
                <div
                    className={ChatSettingsCSS.collapsibleHeader}
                    onClick={() => toggleCollapse("chatInformation")}
                    aria-expanded={openSections.chatInformation}
                    role="button"
                    tabIndex={0}
                >
                    <span>Chat information</span>
                    <FontAwesomeIcon className={ChatSettingsCSS.faAngleRight} icon={openSections.chatInformation ? faAngleDown : faAngleRight} />
                </div>
                <div className={`${ChatSettingsCSS.collapsibleContentList} ${openSections.chatInformation ? ChatSettingsCSS.showContent : ChatSettingsCSS.hideContent}`}>
                    <div className={ChatSettingsCSS.collapsibleContent}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <FontAwesomeIcon className={ChatSettingsCSS.optionIcon} icon={faThumbtack} />
                        </div>
                        <span>View pinned messages</span>
                    </div>
                </div>
                <div
                    className={ChatSettingsCSS.collapsibleHeader}
                    onClick={() => toggleCollapse("customizeChat")}
                    aria-expanded={openSections.customizeChat}
                    role="button"
                    tabIndex={1}
                >
                    <span>Customize Chat</span>
                    <FontAwesomeIcon className={ChatSettingsCSS.faAngleRight} icon={openSections.customizeChat ? faAngleDown : faAngleRight} />
                </div>
                <div className={`${ChatSettingsCSS.collapsibleContentList} ${openSections.customizeChat ? ChatSettingsCSS.showContent : ChatSettingsCSS.hideContent}`}>
                    {conversation.type === "GROUP" && (
                        <>
                            <div className={ChatSettingsCSS.collapsibleContent} onClick={() => handleOpenPopup('changeTitle')}>
                                <div className={ChatSettingsCSS.optionIconContainer}>
                                    <FontAwesomeIcon className={ChatSettingsCSS.optionIcon} icon={faPen} />
                                </div>
                                <span className={ChatSettingsCSS.spanOption}>Change chat name</span>
                                {openPopup === "changeTitle" && <ChangeTitlePopup onClose={handleClosePopup} conversationDTO={conversation} />}
                            </div>
                            <div className={ChatSettingsCSS.imageContainer}>
                                <div className={ChatSettingsCSS.collapsibleContent} onClick={handleClick}>
                                    <div className={ChatSettingsCSS.optionIconContainer}>
                                        <FontAwesomeIcon className={ChatSettingsCSS.optionIcon} icon={faImage} />
                                    </div>
                                    <span className={ChatSettingsCSS.spanOption}>Change image</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                    <div className={ChatSettingsCSS.collapsibleContent} onClick={() => handleOpenPopup('changeTheme')}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <FontAwesomeIcon className={ChatSettingsCSS.optionIcon} icon={faCircleDot} />
                        </div>
                        <span className={ChatSettingsCSS.spanOption}>Change theme</span>
                        {openPopup === "changeTheme" && <ChangeThemePopup onClose={handleClosePopup} />}
                    </div>
                    <div className={ChatSettingsCSS.collapsibleContent} onClick={() => handleOpenPopup('changeEmojiIcon')}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <FontAwesomeIcon className={ChatSettingsCSS.optionIcon} icon={faThumbsUp} />
                        </div>
                        <span className={ChatSettingsCSS.spanOption}>Change emoji icon</span>
                        {openPopup === "changeEmojiIcon" && <ChangeEmojiIconPopup onClose={handleClosePopup} />}
                    </div>
                    <div className={ChatSettingsCSS.collapsibleContent} onClick={() => handleOpenPopup('editNickname')}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <svg className={ChatSettingsCSS.optionIcon} viewBox="0 0 36 36" fill="currentColor" width="21" height="21">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.243 12.238a.368.368 0 0 0-.35.255l-2.18 6.675a.25.25 0 0 0 .238.328h4.584a.25.25 0 0 0 .238-.328l-2.18-6.675a.369.369 0 0 0-.35-.255zm5.802 13.755a1.44 1.44 0 0 1-1.365-.982l-.928-2.844a.25.25 0 0 0-.238-.173H8.973a.25.25 0 0 0-.238.173l-.929 2.844a1.44 1.44 0 1 1-2.722-.94L9.83 10.7a2.563 2.563 0 0 1 4.829 0l4.744 13.37a1.44 1.44 0 0 1-1.357 1.922zm11.207-5.475a.25.25 0 0 0-.266-.25l-2.805.176c-1.659.108-2.434.709-2.434 1.779 0 1.105.942 1.766 2.255 1.766 1.79 0 3.25-1.166 3.25-2.692v-.78zm1.409 5.46a1.33 1.33 0 0 1-1.339-1.336c0-.098-.139-.138-.198-.06-.803 1.058-2.387 1.668-3.925 1.668-2.475 0-4.198-1.56-4.198-3.9 0-2.316 1.7-3.9 4.82-4.088l3.195-.185a.25.25 0 0 0 .236-.25v-.762c0-1.252-1.032-1.829-2.603-1.829-2.066 0-2.316 1.24-3.333 1.24-1.13 0-1.745-1.354-.968-2.172.933-.982 2.349-1.556 4.254-1.556 3.295 0 5.398 1.603 5.398 4.317v7.577a1.33 1.33 0 0 1-1.34 1.335z"></path>
                            </svg>
                        </div>
                        <span className={ChatSettingsCSS.spanOption}>Edit nickname</span>
                        {openPopup === "editNickname" && <ChangeNicknamePopup onClose={handleClosePopup} />}
                    </div>
                </div>
                {conversation.type === "GROUP" && (
                    <>
                        <div
                            className={ChatSettingsCSS.collapsibleHeader}
                            onClick={() => toggleCollapse("chatMembers")}
                            aria-expanded={openSections.chatMembers}
                            role="button"
                            tabIndex={2}
                        >
                            <span>Chat members</span>
                            <FontAwesomeIcon className={ChatSettingsCSS.faAngleRight} icon={openSections.chatMembers ? faAngleDown : faAngleRight} />
                        </div>
                        <div className={`${ChatSettingsCSS.collapsibleContentList} ${openSections.chatMembers ? ChatSettingsCSS.showContent : ChatSettingsCSS.hideContent}`}>
                            {participants !== null && participants.map((participant) => (
                                <>
                                    <div className={ChatSettingsCSS.membersContainer}>
                                        <div className={ChatSettingsCSS.userContainer}>
                                            <div className={ChatSettingsCSS.awatarContainer}>
                                                <img src={participant.imageData
                                                    ? convertToBase64(participant.imageData)
                                                    : userCircle
                                                } alt="userCilce" />
                                            </div>
                                            <div className={ChatSettingsCSS.userDetailsContainer}>
                                                <h4>{participant.nickname !== null && participant.nickname !== "" ? participant.nickname : participant.fullName}</h4>
                                                <span>{participant.role}</span>
                                            </div>
                                        </div>
                                        <div onClick={() => togglePopup(participant.id)} ref={userIconRef} className={ChatSettingsCSS.faEllipsisContainer}>
                                            <FontAwesomeIcon className={ChatSettingsCSS.faEllipsis} icon={faEllipsis} />
                                        </div>
                                    </div>
                                    {activeUserId === participant.id && (
                                        <div ref={popupRef} className={ChatSettingsCSS.popupContainer}>
                                            <UserOptionsMenu participant={participant} />
                                        </div>
                                    )}
                                </>
                            ))}
                            {participants !== null && participants.some(p => p.id === getUserIdFromToken() && p.role === "ADMIN") && (
                                <div
                                    className={ChatSettingsCSS.addPeopleContiainer}
                                    onClick={() => handleOpenPopup('addUser')}
                                >
                                    <div className={ChatSettingsCSS.userContainer}>
                                        <div className={ChatSettingsCSS.faUserPlusContainer}>
                                            <FontAwesomeIcon className={ChatSettingsCSS.faUserPlus} icon={faUserPlus} />
                                        </div>
                                        <div className={ChatSettingsCSS.userDetailsContainer}>
                                            <h4>Add people</h4>
                                        </div>
                                    </div>
                                    {openPopup === "addUser" && <AddUserPopup onClose={handleClosePopup} />}
                                </div>
                            )}
                        </div>
                    </>
                )}
                <div
                    className={ChatSettingsCSS.collapsibleHeader}
                    onClick={() => toggleCollapse("multimediaFiles")}
                    aria-expanded={openSections.multimediaFiles}
                    role="button"
                    tabIndex={3}
                >
                    <span>Multimedia and Files</span>
                    <FontAwesomeIcon className={ChatSettingsCSS.faAngleRight} icon={openSections.multimediaFiles ? faAngleDown : faAngleRight} />
                </div>
                <div className={`${ChatSettingsCSS.collapsibleContentList} ${openSections.multimediaFiles ? ChatSettingsCSS.showContent : ChatSettingsCSS.hideContent}`}>
                    <div className={ChatSettingsCSS.collapsibleContent}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <svg className={ChatSettingsCSS.optionIcon} viewBox="0 0 36 36" fill="currentColor" width="21" height="21">
                                <path d="M17.5 19.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M24 12.75c0 .138.112.25.25.25H27a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3v-2.75a.25.25 0 0 0-.25-.25H9a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2.75zM21 9.5H9a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h2.75a.25.25 0 0 0 .25-.25V16a3 3 0 0 1 3-3h6.25a.25.25 0 0 0 .25-.25V10a.5.5 0 0 0-.5-.5zM14.5 16a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 .5.5v7.577a.25.25 0 0 1-.375.217l-3.725-2.15a4.8 4.8 0 0 0-4.8 0l-3.725 2.15a.25.25 0 0 1-.375-.217V16z"></path>
                            </svg>
                        </div>
                        <span>Multimedia</span>
                    </div>
                    <div className={ChatSettingsCSS.collapsibleContent}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <svg className={ChatSettingsCSS.optionIcon} viewBox="0 0 36 36" fill="currentColor" width="21" height="21">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M18 8a1 1 0 0 0-1-1h-6a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V17a1 1 0 0 0-1-1h-4a4 4 0 0 1-4-4V8zm-6 7a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1zm1 3.5a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H13zm0 4.5a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2H13z"></path><path d="M22 14h4.01a.99.99 0 0 0 .7-1.69l-5.02-5.02a.99.99 0 0 0-1.69.7V12a2 2 0 0 0 2 2z"></path>
                            </svg>
                        </div>
                        <span>Files</span>
                    </div>
                </div>
                <div
                    className={ChatSettingsCSS.collapsibleHeader}
                    onClick={() => toggleCollapse("privacySupport")}
                    aria-expanded={openSections.privacySupport}
                    role="button"
                    tabIndex={4}
                >
                    <span>Privacy and support</span>
                    <FontAwesomeIcon className={ChatSettingsCSS.faAngleRight} icon={openSections.privacySupport ? faAngleDown : faAngleRight} />
                </div>
                <div className={`${ChatSettingsCSS.collapsibleContentList} ${openSections.privacySupport ? ChatSettingsCSS.showContent : ChatSettingsCSS.hideContent}`}>
                    <div className={ChatSettingsCSS.collapsibleContent}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <svg className={ChatSettingsCSS.optionIcon} viewBox="0 0 36 36" fill="currentColor" width="21" height="21">
                                <path d="M9.244 24.99h-.001L26.867 7.366a1.25 1.25 0 1 1 1.768 1.768l-3.296 3.295a2 2 0 0 0-.554 1.766l1.05 5.877a3 3 0 0 0 .831 1.594l.92.92a1.414 1.414 0 0 1-1 2.414H13.597a2 2 0 0 0-1.414.586l-3.05 3.049a1.25 1.25 0 1 1-1.767-1.768l1.878-1.877z"></path><path d="M15.041 27.498c-.045-.273.183-.498.459-.498h5c.276 0 .504.226.459.498a3 3 0 0 1-5.918 0zM21.522 8.024a6.57 6.57 0 0 0-9.99 4.39L10.537 18l-.056.27c-.152.729.738 1.209 1.264.682l9.862-9.86c.312-.314.29-.83-.084-1.068z"></path>
                            </svg>
                        </div>
                        <span>Pause notifications</span>
                    </div>
                    <div className={ChatSettingsCSS.collapsibleContent}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <svg className={ChatSettingsCSS.optionIcon} viewBox="0 0 36 36" fill="currentColor" width="21" height="21">
                                <path d="M7.705 28.41c-.19-.467.087-.97.444-1.327L27.867 7.366a1.25 1.25 0 1 1 1.768 1.768l-1.818 1.817c-.34.34-.384.87-.148 1.29C28.525 13.758 29 15.541 29 17.5v.003c-.001 6.103-4.607 10.57-11 10.57-1.066 0-2.08-.095-3.033-.327a4.26 4.26 0 0 0-2.39.09L8.91 28.962c-.36.099-.957.054-1.205-.552zM22.184 7.697C20.913 7.244 19.506 7 18 7 11.607 7 7 11.396 7 17.498v.002c0 1.689.27 3.245.884 4.615a.927.927 0 0 0 1.474.22L22.476 9.215c.481-.48.35-1.29-.292-1.52z"></path>
                            </svg>
                        </div>
                        <span>Restrict</span>
                    </div>
                    <div className={ChatSettingsCSS.collapsibleContent}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <FontAwesomeIcon className={ChatSettingsCSS.optionIcon} icon={faBan} />
                        </div>
                        <span>Block</span>
                    </div>
                    <div className={ChatSettingsCSS.collapsibleContent}>
                        <div className={ChatSettingsCSS.optionIconContainer}>
                            <FontAwesomeIcon className={ChatSettingsCSS.optionIcon} icon={faTriangleExclamation} />
                        </div>
                        <span>Report</span>
                    </div>
                </div>
            </div>
        </div>
    )
}