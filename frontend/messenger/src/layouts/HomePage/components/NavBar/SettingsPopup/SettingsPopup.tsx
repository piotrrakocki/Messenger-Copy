import React, { useState } from 'react';
import SettingsPopupCSS from "./SettingsPopup.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { UserSettings } from '../../UserSettings/UserSettings';
import { useNavigate } from 'react-router-dom';

interface ChatOptionsPopupProps {
    isVisible: boolean;
}

export const SettingsPopup: React.FC<ChatOptionsPopupProps> = ({ isVisible }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleLogout = async () => {
        try {
            await fetch(
                `${apiUrl}/v1/logout`,
                {
                    method: "POST",
                    credentials: "include",
                });

            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            navigate("/login");
        } catch (error) {
            console.log("Error while log out ", error);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={SettingsPopupCSS.popup}>
            <div className={SettingsPopupCSS.settingsContainer}>
                <div
                    className={SettingsPopupCSS.optionContainer}
                    onClick={handleModalOpen}
                >
                    <div className={SettingsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faEnvelope} className={SettingsPopupCSS.customIcon} />
                    </div>
                    <p>Preferences</p>
                </div>
            </div>
            <hr />
            <div className={SettingsPopupCSS.settingsContainer}>
                <div
                    className={SettingsPopupCSS.optionContainer}
                    onClick={handleLogout}
                >
                    <div className={SettingsPopupCSS.customIconContainer}>
                        <FontAwesomeIcon icon={faTriangleExclamation} className={SettingsPopupCSS.customIcon} />
                    </div>
                    <p>Log out</p>
                </div>
            </div>

            {isModalOpen && <UserSettings onClose={handleModalClose} />}
        </div>
    )
}