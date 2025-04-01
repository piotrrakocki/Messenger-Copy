import React, { useEffect, useRef, useState } from 'react';
import NavBarCSS from "./NavBar.module.css";
import img from "./../../../../images/HomePage/user-circle.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive, faComment, faCommentDots, faStore } from '@fortawesome/free-solid-svg-icons';
import { SettingsPopup } from './SettingsPopup/SettingsPopup';
import { getToken } from '../../../../utils/auth';

interface NavBarProps {
    activeIcon: number;
    setActiveIcon: (iconId: number) => void
    onUserIconClick: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ activeIcon, setActiveIcon, onUserIconClick }) => {
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [isPopupVisible, setPopupVisible] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLImageElement>(null);
    const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);

    const icons = [
        { id: 1, icon: faComment },
        { id: 2, icon: faStore },
        { id: 3, icon: faCommentDots },
        { id: 4, icon: faBoxArchive }
    ];

    const handleIconClick = (iconId: number) => {
        setActiveIcon(iconId);
    };

    const togglePopup = (event: React.MouseEvent) => {
        event.stopPropagation();
        setPopupVisible((prev) => !prev);
    };

    const getProfilePicture = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/profile-picture/get`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            if (response.ok) {
                const blob = await response.blob();
                const render = new FileReader();
                render.onloadend = () => {
                    setProfilePicture(render.result as string);
                }
                render.readAsDataURL(blob);
            } else {
                console.error("Error fetching user data")
                setProfilePicture(img);
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    }

    useEffect(() => {
        getProfilePicture();
    }, []);

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

    return (
        <div className={NavBarCSS.container}>
            <div className={NavBarCSS.iconGroupContainer}>
                {icons.map(({ id, icon }) => (
                    <div
                        key={id}
                        className={`${NavBarCSS.iconContainer} ${activeIcon === id ? NavBarCSS.activeIcon : ""}`}
                        onClick={() => handleIconClick(id)}
                    >
                        <FontAwesomeIcon
                            className={`${NavBarCSS.icon} ${activeIcon === id ? NavBarCSS.actIcon : ""}`}
                            icon={icon}
                        />
                    </div>
                ))}
            </div>
            <div className={NavBarCSS.userIconWrapper}>
                <div className={NavBarCSS.iconUserContainer}>
                    <img
                        ref={userIconRef}
                        className={NavBarCSS.iconUser}
                        onClick={togglePopup}
                        src={profilePicture}
                        alt="user-circle"
                    />
                </div>
                {isPopupVisible && (
                    <div ref={popupRef}>
                        <SettingsPopup isVisible={isPopupVisible} />
                    </div>
                )}
            </div>
        </div>
    )
}