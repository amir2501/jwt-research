require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./auth");

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "JWT Research API"
    });
});

app.post("/login", (req, res) => {
    const {username, password} = req.body;

    if (username !== "alice" || password !== "password123") {
        return res.status(401).json({
            error: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        {
            userId: 1,
            username: "alice",
            role: "user"
        },
        JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    res.json({
        token
    });
});

app.get("/profile", authenticateToken, (req, res) => {
    res.json({
        message: "Request successful",
        user: {
            userId: req.user.userId,
            username: req.user.username,
            role: req.user.role
        }
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});