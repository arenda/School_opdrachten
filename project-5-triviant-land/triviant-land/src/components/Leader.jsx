import { useState, useEffect } from "react";
import "./css/leader.css";
import Cookies from "js-cookie";

function Leader() {

    if (!Cookies.get('user')) {
        window.location.href = "/index";
    }

    const [users, setUsers] = useState([]);

    // Functie om de gebruikers op te halen
    const fetchUsers = () => {
        fetch("http://localhost:3001/users")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                const sorted = data.sort((a, b) => b.score - a.score);
                sorted.length = 10;
                setUsers(sorted);
            })
            .catch((err) => {
                console.error("Failed to load Leaderboard:", err);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="leaderboard-container">
                <h2>Leaderboard</h2>

                <table className="leaderboard">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Username</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.username}</td>
                                <td>{user.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="home-button"
                onClick={() => window.location.href = "/home"}>
                <img src="./src/components/img/home.png" alt="home" style={{ width: "31px", height: "35px" }} />
            </button></div>

    );
}

export default Leader;
