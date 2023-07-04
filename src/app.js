const express = require("express");
const app = express();



const db = require("./db/connection");






const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})