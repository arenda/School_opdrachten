import React, { useState } from "react";
import CookieManager from './cookie';
import './css/register.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            setMessage("Password must be at least 6 characters long");
            return false;
        }
        if (!formData.email.includes('@')) {
            setMessage("Please enter a valid email address");
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        console.log("Form submitted:", formData);

        if (!validateForm()) {
            console.log("Form validation failed");
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            console.log("Sending POST request to backend...");
            const res = await fetch("http://localhost:3001/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            console.log("Response received. Status:", res.status);

            const data = await res.json(); // Let op: dit crasht als de backend geen JSON stuurt
            console.log("Response data:", data);

            if (res.ok) {
                console.log("Registration successful. Setting cookies...");
                setMessage("Registration successful! Redirecting...");
                CookieManager.setLoginCookies(formData.username, data.token);
                setTimeout(() => {
                    window.location.href = "/home";
                }, 1500);
            } else {
                console.warn("Registration failed with message:", data.error);
                setMessage(data.error || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("An error occurred during registration");
        } finally {
            console.log("Finished registration attempt");
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form">
                <h2>Register</h2>
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        minLength="3"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>
                {message && (
                    <p className={message.includes("successful") ? "success" : "error"}>
                        {message}
                    </p>
                )}
                <p className="login-link">
                    <a href="/login">Already have an account? Login here!</a>
                </p>
            </form>
        </div>
    );
}

export default RegisterForm;
