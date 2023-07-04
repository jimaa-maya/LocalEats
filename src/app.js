const express = require("express");
const connectToMongo = require("./db/connection");

const app = express();
const port = 3000;


app.listen(port, () => {
    console.log(`Server is running on ${port}`);
    connectToMongo();
});


module.exports = app;