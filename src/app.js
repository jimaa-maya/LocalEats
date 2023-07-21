require('dotenv').config();
const express = require('express');
const passport = require('passport')
const connectToMongo = require('./db/connection');
const cookieParser = require('cookie-parser');
require('./middleware/passport-setup');
const apiRoutes = require('./routes');


const app = express();
const port = 3000;

// Parse JSON bodies
app.use(express.json());

app.set("view engine","ejs");
app.set("views", "./views");
app.use(passport.initialize());

// Mount all routes from the routes directory under the '/api' path
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
  connectToMongo();
});
app.use(cookieParser());
app.use('/api', apiRoutes);
app.get('/',(req,res) =>{
  res.render("home")
})
module.exports = app;