import React, { useEffect, useRef, useState } from 'react';
import UserSettingsCSS from "./UserSettings.module.css";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import userCircle from "./../../../../images/HomePage/user-circle.png";
import { getToken } from '../../../../utils/auth';

interface UserSettingsProps {
    onClose: () => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ onClose }) => {
    const token = getToken();
    const apiUrl = process.env.REACT_APP_API_URL;
    const modalRef = useRef<HTMLDivElement>(null);
    const [userData, setUserData] = useState<{ firstName: string, lastName: string }>();
    const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
    const [fileName, setFileName] = useState("No file selected");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [hasProfilePicture, setHasProfilePicture] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFileName(files[0].name);
            setSelectedFile(files[0]);
        } else {
            setFileName("No file selected");
            setSelectedFile(null);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/profile-picture/delete`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            console.log("Response status:", response.status);
            console.log("Response body:", await response.text());

            if (response.ok) {
                alert("Profile picture deleted successfully.");
                setProfilePicture(userCircle);
                setHasProfilePicture(false);
            } else {
                alert("Failed to delete profile picture.");
            }
        } catch (error) {
            console.error("Error deleting profile picture:", error);
            alert("An error occurred while deleting the profile picture.");
        }
    };


    const handleUpdate = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile); // Dodanie pliku do FormData

        try {
            const response = await fetch(`${apiUrl}/v1/profile-picture/update`, {
                method: "PUT", // Użycie metody PUT
                headers: {
                    "Authorization": `Bearer ${token}`, // Dodanie tokenu autoryzacyjnego
                },
                body: formData, // Przekazanie FormData jako treści żądania
            });

            if (response.ok) {
                alert("Profile picture updated successfully.");
            } else {
                alert("Failed to update profile picture.");
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    };


    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }
        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch(`${apiUrl}/v1/profile-picture/add`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("Profile picture updated successfully.");
            } else {
                alert("Failed to update profile picture.");
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
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
                    setHasProfilePicture(true);
                }
                render.readAsDataURL(blob);
            } else {
                console.error("Error fetching user data")
                setProfilePicture(userCircle);
                setHasProfilePicture(false);
            }
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    }

    useEffect(() => {
        getProfilePicture();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/user/getFirstAndLastName`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                console.error("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data", error);
            setHasProfilePicture(false);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

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
        <div className={UserSettingsCSS.overlay}>
            <div className={UserSettingsCSS.modal} ref={modalRef}>
                <div className={UserSettingsCSS.headerContainer}>
                    <button onClick={onClose} className={UserSettingsCSS.closeButton}>
                        <FontAwesomeIcon icon={faXmark} style={{ color: "#fff" }} />
                    </button>
                    <h2>Preferences</h2>
                </div>
                <div className={UserSettingsCSS.accountContainer}>
                    <h3>Account</h3>
                    <div className={UserSettingsCSS.userDetailsContainer}>
                        <img src={profilePicture} alt="user-circle" />
                        <div className={UserSettingsCSS.userDetails}>
                            <h4>{userData?.firstName} {userData?.lastName}</h4>
                            <span>View your profile</span>
                        </div>
                    </div>
                    {hasProfilePicture ? (
                        <>
                            <div className={UserSettingsCSS.activityStatusContainer}>
                                <p>Change profile picture</p>
                                <label className={UserSettingsCSS.fileInput}>
                                    Choose file
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                    <span className={UserSettingsCSS.fileName}>{fileName}</span> {/* Wyświetlanie nazwy pliku */}
                                </label>
                                <button
                                    className={UserSettingsCSS.uploadButton}
                                    onClick={handleUpdate}
                                >
                                    Change
                                </button>
                            </div>
                            <div className={UserSettingsCSS.activityStatusContainer}>
                                <p>Remove profile picture</p>
                                <button
                                    className={UserSettingsCSS.uploadButton}
                                    onClick={handleDelete}
                                >
                                    Remove
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={UserSettingsCSS.activityStatusContainer}>
                            <p>Add profile picture</p>
                            <label className={UserSettingsCSS.fileInput}>
                                Choose file
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <span className={UserSettingsCSS.fileName}>{fileName}</span> {/* Wyświetlanie nazwy pliku */}
                            </label>
                            <button
                                className={UserSettingsCSS.uploadButton}
                                onClick={handleUpload}
                            >
                                Upload
                            </button>
                        </div>
                    )}
                </div>
                <hr />
                <div className={UserSettingsCSS.activityStatusContainer}>
                    <div className={UserSettingsCSS.iconHeaderContainer}>
                        <div className={UserSettingsCSS.iconContainer}>
                            <svg className={UserSettingsCSS.icon} viewBox="0 0 36 36" fill="currentColor" width="27" height="27">
                                <path d="M22.278 25.778a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z"></path><path d="M28.734 20.414c-.071.32-.435.463-.735.331A5.5 5.5 0 0 0 20.745 28c.133.3-.011.664-.33.735-.778.174-1.586.266-2.415.266-6.075 0-11-4.925-11-11S11.925 7 18 7s11 4.925 11 11c0 .83-.092 1.637-.266 2.414z"></path>
                            </svg>
                        </div>
                        <h4>Activity status</h4>
                    </div>
                    <label className={UserSettingsCSS.switch}>
                        <input type="checkbox" />
                        <span className={`${UserSettingsCSS.slider} ${UserSettingsCSS.round}`}></span>
                    </label>
                </div>
                <hr />
                <div className={UserSettingsCSS.accountContainer}>
                    <h3>Notifications</h3>
                    <div className={UserSettingsCSS.activityStatusContainer}>
                        <div className={UserSettingsCSS.iconHeaderContainer}>
                            <div className={UserSettingsCSS.iconContainer}>
                                <svg className={UserSettingsCSS.icon} viewBox="0 0 36 36" fill="currentColor" width="27" height="27">
                                    <path d="M22.278 25.778a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z"></path><path d="M28.734 20.414c-.071.32-.435.463-.735.331A5.5 5.5 0 0 0 20.745 28c.133.3-.011.664-.33.735-.778.174-1.586.266-2.415.266-6.075 0-11-4.925-11-11S11.925 7 18 7s11 4.925 11 11c0 .83-.092 1.637-.266 2.414z"></path>
                                </svg>
                            </div>
                            <h4>Do not disturb</h4>
                        </div>
                        <label className={UserSettingsCSS.switch}>
                            <input type="checkbox" />
                            <span className={`${UserSettingsCSS.slider} ${UserSettingsCSS.round}`}></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};