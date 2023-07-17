const express = require('express');
const cookieParser = require('cookie-parser');
const connectToMongo = require('./db/connection');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;



app.use(cookieParser());

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    connectToMongo();
});

module.exports = app;