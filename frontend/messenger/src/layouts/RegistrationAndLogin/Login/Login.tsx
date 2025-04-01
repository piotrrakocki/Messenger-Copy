import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginCSS from "./Login.module.css";
import { setToken } from "./../../../utils/auth";

export const Login = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { email, password } = formData;
        const formPayload = {
            email,
            password
        }

        try {
            const response = await fetch(`${apiUrl}/v1/auth/authenticate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formPayload),
                }
            );
            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                navigate("/");
            }
        } catch (error: unknown) {
            console.error("Error: ", error);
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    }

    return (
        <div className={LoginCSS.container}>
            <div className={LoginCSS.imgContainer}>
                <img
                    src={require("../../../images/RegistrationAndLogin/messenger.png")}
                    height="75"
                    width="75"
                    alt="messenger_icon"
                />
            </div>
            <div className={LoginCSS.textContainer}>
                {error ? (
                    <p>{error}</p>
                ) : (
                    <h2>Stay in touch with your favorite people</h2>
                )}
            </div>
            <form onSubmit={handleSubmit}>
                <div className={LoginCSS.inputContainer}>
                    <input
                        name="email"
                        placeholder='Eamil Address'
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        placeholder='Password'
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={LoginCSS.buttonContainer}>
                    <button type="submit">Continue</button>
                </div>
            </form>
            <div className={LoginCSS.checkboxContainer}>
                <input type="checkbox" name="" id="" />
                <label>Don't log me out</label>
            </div>
            <div className={LoginCSS.haveNoAccount}>
                <a href="/register">Don't have an account?</a>
            </div>
        </div>
    )
}