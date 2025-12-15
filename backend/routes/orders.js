import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/", (req, res) => {
    const { user_id, cart, total_price } = req.body;

    db.query(
        "INSERT INTO orders (user_id, order_details, total_price) VALUES (?, ?, ?)",
        [user_id, JSON.stringify(cart), total_price],
        (err) => {
            if (err) return res.status(500).send("Error saving order");
            res.json({ message: "Order saved!" });
        }
    );
});

router.get("/:user_id", (req, res) => {
    db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [req.params.user_id],
        (err, results) => {
            if (err) return res.status(500).send("Error loading history");
            res.json(results);
        }
    );
});

export default router;
