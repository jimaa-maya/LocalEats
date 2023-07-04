const mongoose = require('mongoose');

// MongoDB Atlas connection string
const url = "mongodb+srv://localeats:Ourteam2023@cluster0.qjho3ft.mongodb.net/";

mongoose.connect(url, { useNewUrlParser: true });

db = mongoose.connection;

db.once("open", () => {
    console.log("Database connected:", url);
});

db.on("error", (err) => {
    console.error("connection error:", err);
});

module.exports = db;
