import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import CookieManager from './cookie';

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Logged in successfully!");
            CookieManager.setLoginCookies(username, data.token);
            setTimeout(() => {
                window.location.href = "/home";
            }, 1000);
        } else {
            setMessage("Fout: " + data.error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            <p>{message}</p>
            <p>
                <a href="register.html">Don't have an account?</a>
            </p>
        </form>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<LoginForm />);

export default LoginForm;