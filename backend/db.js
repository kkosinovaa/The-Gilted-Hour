import mysql from "mysql2";

export const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "19102007",
    database: process.env.DB_NAME || "gilded_restaurant"
});

db.connect(err => {
    if (err) console.log("DB Connection ERROR:", err);
    else console.log("Connected to MySQL");
});
