import React, { useRef, useState } from 'react';
import UserListPopupCSS from "./UserListPopupCSS.module.css";
import { UserNameDTO } from '../../../../../types/UserNameDTO';
import img from "./../../../../../images/HomePage/user-circle.png";

interface UserListPopupProps {
    isVisible: boolean;
    searchData: UserNameDTO[];
    onUserSelect: (user: UserNameDTO) => void;
}

export const UserListPopup: React.FC<UserListPopupProps> = ({ isVisible, searchData, onUserSelect }) => {

    const convertToBase64 = (imageData: string): string => {
        return `data:image/jpeg;base64,${imageData}`;
    };

    if (!isVisible) return null;
    return (
        <div className={UserListPopupCSS.popup}>
            <div>
                {searchData.map((user) => (
                    <div
                        key={user.id}
                        className={UserListPopupCSS.searchChatContainer}
                        onClick={() => {
                            console.log('User clicked:', user);
                            onUserSelect(user);
                        }}                    >
                        <div className={UserListPopupCSS.searchImgUserCircleContainer}>
                            <img src={user.imageData ? convertToBase64(user.imageData) : img} alt="user-circle" />
                        </div>
                        <div className={UserListPopupCSS.userNameContainer}>
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}