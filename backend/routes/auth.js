import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users (email, password, address) VALUES (?, ?, ?)",
        [email, hashedPassword, address],
        (err) => {
            if (err) return res.status(500).json({ message: "Email exists" });
            res.json({ message: "Account created" });
        }
    );
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, data) => {
        if (err || data.length === 0) return res.status(400).json({ message: "User not found" });

        const user = data[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) return res.status(400).json({ message: "Wrong password" });

        res.json({
            message: "Login successful",
            user_id: user.id
        });
    });
});

export default router;
