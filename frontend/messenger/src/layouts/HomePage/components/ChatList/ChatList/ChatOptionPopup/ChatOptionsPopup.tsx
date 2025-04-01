import React from 'react';
import ChatOptionsPopupCSS from "./ChatOptionsPopup.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faBell, faBoxArchive, faEnvelope, faPhone, faTrash, faTriangleExclamation, faUser, faVideo } from '@fortawesome/free-solid-svg-icons';

interface ChatOptionsPopupProps {
    isVisible: boolean;
}

export const ChatOptionsPopup: React.FC<ChatOptionsPopupProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className={ChatOptionsPopupCSS.popup}>
            <div className={ChatOptionsPopupCSS.settingsContainer}>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faEnvelope} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>Mark as unread</p>
                </div>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faBell} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>Mute notifications</p>
                </div>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faUser} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>View profile</p>
                </div>
            </div>
            <hr />
            <div className={ChatOptionsPopupCSS.settingsContainer}>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faPhone} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>Voice call</p>
                </div>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faVideo} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>Video chat</p>
                </div>
            </div>
            <hr />
            <div className={ChatOptionsPopupCSS.settingsContainer}>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faBan} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>Block</p>
                </div>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faBoxArchive} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>Archive chat</p>
                </div>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faTrash} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>Delete chat</p>
                </div>
                <div className={ChatOptionsPopupCSS.optionContainer}>
                    <div className={ChatOptionsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faTriangleExclamation} className={ChatOptionsPopupCSS.customIcon} />
                    </div>
                    <p>Report</p>
                </div>
            </div>
        </div>
    )
}