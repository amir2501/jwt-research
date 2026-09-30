const express = require("express");

const app = express();

app.use(express.json());

app.get("/profile", (req, res) => {
    res.json({
        message: "Request successful",
        user: {
            userId: 1,
            username: "alice",
            role: "user"
        }
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Baseline API running on http://localhost:${PORT}`);
});