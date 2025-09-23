import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "bit_academy",
    password: "bit_academy",
    database: "triviantland"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to database 'Triviantland'");
    }
});

// Auth check middleware
const authenticateUser = (req, res, next) => {
    const userCookie = req.cookies.user;
    const tokenCookie = req.cookies.userToken;

    if (!userCookie || !tokenCookie) {
        return res.status(401).json({ error: "Not logged in" });
    }
    next();
};

// Check auth status
app.get("/check-auth", authenticateUser, (req, res) => {
    res.json({
        isLoggedIn: true,
        username: req.cookies.user
    });
});

// Register endpoint
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const checkUser = "SELECT * FROM Users WHERE username = ? OR email = ?";
        db.query(checkUser, [username, email], async (err, result) => {
            if (err) return res.status(500).json({ error: "Registration failed" });
            if (result.length > 0) return res.status(400).json({ error: "Username or email already exists" });

            const hashedPassword = await bcrypt.hash(password, 10);
            const sql = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";

            db.query(sql, [username, email, hashedPassword], (err) => {
                if (err) return res.status(500).json({ error: "Registration failed" });

                const token = Math.random().toString(36).slice(2);

                res.cookie('user', username, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: false,
                    secure: false,
                    sameSite: 'lax'
                });

                res.cookie('userToken', token, {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax'
                });

                res.json({
                    success: true,
                    username: username,
                    token: token
                });
            });
        });
    } catch {
        res.status(500).json({ error: "Server error during registration" });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const sql = "SELECT * FROM Users WHERE username = ?";
        db.query(sql, [username], async (err, result) => {
            if (err) return res.status(500).json({ error: "Login failed" });
            if (result.length === 0) return res.status(401).json({ error: "Invalid username or password" });

            const passwordMatch = await bcrypt.compare(password, result[0].password);
            if (!passwordMatch) return res.status(401).json({ error: "Invalid username or password" });

            const token = Math.random().toString(36).slice(2);

            res.cookie('user', username, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                secure: false,
                sameSite: 'lax'
            });

            res.cookie('userToken', token, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });

            res.json({
                success: true,
                username: username,
                token: token
            });
        });
    } catch {
        res.status(500).json({ error: "Server error during login" });
    }
});

// Logout endpoint
app.post("/logout", (req, res) => {
    res.clearCookie('user');
    res.clearCookie('userToken');
    res.json({ success: true });
});

app.listen(3001, () => {
    console.log("🚀 Server running on http://localhost:3001");
});

// Users endpoint
app.get("/users", (req, res) => {
    const sql = "SELECT user_id as id, username, score FROM Users ORDER BY score DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Failed to fetch users" });
        }
        res.json(result);
    });
});

// Increase score endpoint
app.put("/users/:username/:difficulty/increase-score", (req, res) => {
    const { username, difficulty } = req.params;
    let sql = "";
    let score = 0;
    if (difficulty === "easy") {
        score = 5;
        console.log(+5);
    } else if (difficulty === "medium") {
        score = 10;
        console.log(+10);
    } else if (difficulty === "hard") {
        score = 15;
        console.log(+15);
    }

    sql = "UPDATE Users SET score = score + ? WHERE username = ?";

    console.log(`+${score}`);

    db.query(sql, [score, username], (err, result) => {
        if (err) {
            console.error("Error updating score:", err);
            return res.status(500).json({ error: "Failed to update score" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Score updated successfully" });
    });
});

//decrease score
app.put("/users/:username/:difficulty/decrease-score", (req, res) => {
    const { username, difficulty } = req.params;
    let sql = "";
    let score = 0;
    if (difficulty === "easy") {
        score = 2;
        console.log(-2);
    } else if (difficulty === "medium") {
        score = 5;
        console.log(-5);
    } else if (difficulty === "hard") {
        score = 10;
        console.log(-10);
    }

    sql = "UPDATE Users SET score = score - ? WHERE username = ?";

    console.log(`+${score}`);

    db.query(sql, [score, username], (err, result) => {
        if (err) {
            console.error("Error updating score:", err);
            return res.status(500).json({ error: "Failed to update score" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Score updated successfully" });
    });
});

// Get score endpoint
app.get("/users/:username", (req, res) => {
    const { username } = req.params;
    const sql = "SELECT score FROM Users WHERE username = ?";
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error("Error fetching user score:", err);
            return res.status(500).json({ error: "Failed to fetch user score" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ score: result[0].score });
    });
});

// Update account
app.post("/update-account", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hash het wachtwoord
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "UPDATE Users SET username = ?, password = ? WHERE username = ?";
        db.query(sql, [username, hashedPassword, username], (err, result) => {
            if (err) {
                console.error("error by update:", err);
                return res.status(500).json({ error: "Update failed" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ success: true, message: "Password successfully updated" });
        });
    } catch (err) {
        console.error("Hashing error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Delete account endpoint
app.delete("/delete-account", authenticateUser, (req, res) => {
    const username = req.cookies.user;

    try {
        const deleteUser = "DELETE FROM Users WHERE username = ?";
        db.query(deleteUser, [username], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error("Delete error:", deleteErr);
                return res.status(500).json({ error: "Error deleting account" });
            }

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ error: "Account not found" });
            }

            // Clear cookies
            res.clearCookie('user');
            res.clearCookie('userToken');

            res.json({ message: "Account successfully deleted" });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error while deleting account" });
    }
});