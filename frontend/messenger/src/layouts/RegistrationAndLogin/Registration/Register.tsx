import React, { useState } from 'react';
import RegisterCSS from "./RegisterCSS.module.css";

export const Register = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const curentYear = new Date().getFullYear();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        day: 1,
        month: 1,
        year: curentYear,
        gender: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { firstName, lastName, email, day, month, year, gender, password } = formData;
        const fromPayload = {
            firstName,
            lastName,
            email,
            dateOfBirth: `${year}-${month}-${day}`,
            gender,
            password
        }

        try {
            const response = await fetch(`${apiUrl}/v1/registration`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fromPayload),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Registration successful:', data);
            } else {
                console.error('Error registering:', data);
            }
        } catch (error) {
            console.error('An error occurred during registration:', error);
        }
    };

    const generateMonthOptions = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.map((month, index) => (
            <option key={index} value={index + 1}>{month}</option>
        ));
    };

    const generateDayOptions = () => {
        return Array.from({ length: 31 }, (_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
        ));
    };

    const generateYearOptions = (startYear: number, endYear: number) => {
        return Array.from({ length: startYear - endYear + 1 }, (_, i) => {
            const year = startYear - i;
            return <option key={year} value={year}>{year}</option>
        });
    };

    return (
        <div className={RegisterCSS.container}>
            <div className={RegisterCSS.imgContainer}>
                <img
                    src={require("../../../images/RegistrationAndLogin/messenger.png")}
                    height="75"
                    width="75"
                    alt="messenger_icon"
                />
            </div>
            <form onSubmit={handleSubmit} className={RegisterCSS.formContainer}>
                <div className={RegisterCSS.textContainer}>
                    <h2>Create a new account</h2>
                    <p>It's quick and easy.</p>
                </div>
                <div className={RegisterCSS.inputContainer}>
                    <div className={RegisterCSS.nameContainer}>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            placeholder="First name"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            placeholder="Last name"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={RegisterCSS.dateContainer}>
                        <div>
                            <p>Birthday</p>
                        </div>
                        <div className={RegisterCSS.dateSelectContainer}>
                            <select
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                            >
                                {generateMonthOptions()}
                            </select>
                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                            >
                                {generateDayOptions()}
                            </select>
                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                            >
                                {generateYearOptions(curentYear, curentYear - 100)}
                            </select>
                        </div>
                    </div>
                    <div className={RegisterCSS.genderContainer}>
                        <div>
                            <p>Gender</p>
                        </div>
                        <div className={RegisterCSS.genderlabelContainer}>
                            <label className={RegisterCSS.checkboxContainer}>
                                Male
                                <input
                                    type="radio"
                                    name="gender"
                                    value="MALE"
                                    checked={formData.gender === "MALE"}
                                    onChange={handleChange}
                                />
                            </label>
                            <label className={RegisterCSS.checkboxContainer}>
                                Female
                                <input
                                    type="radio"
                                    name="gender"
                                    value="FEMALE"
                                    checked={formData.gender === "FEMALE"}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    </div>
                    <div className={RegisterCSS.emailContainer}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            placeholder="Address Email"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={RegisterCSS.passwordContainer}>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            placeholder="New password"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={RegisterCSS.policyComponent}>
                        <p>
                            People who use our service may have uploaded your contact information to messenger. <a href="/register">Learn more.</a>
                        </p>
                        <p>
                            By clicking Sign Up, you agree to our <a href="/register">Terms</a>. Learn how we collect,
                            use and share your data in our <a href="/register">Privacy Policy</a> and how we use cookies
                            and similar technology in our Cookies Policy.
                            You may receive SMS Notifications from us and can opt out any time.
                        </p>
                    </div>
                    <div className={RegisterCSS.buttonContainer}>
                        <button type='submit'>Sign up</button>
                    </div>
                    <div className={RegisterCSS.haveAccount}>
                        <a href='/login'>Already have an account</a>
                    </div>
                </div>
            </form>
        </div>
    )
}