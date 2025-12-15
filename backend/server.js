import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/orders.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});
