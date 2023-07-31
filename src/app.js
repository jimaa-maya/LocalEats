require('dotenv').config();
const express = require('express');
const passport = require('passport');
const connectToMongo = require('./db/connection');
const cookieParser = require('cookie-parser');
require('./middleware/passport-setup');
const apiRoutes = require('./routes');

const app = express();
const port = 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(cookieParser(process.env.SECRET_KEY));
app.use(passport.initialize());

// Connect to MongoDB
connectToMongo();

// API Routes
app.use('/api', apiRoutes);

// Home Route
app.get('/', (req, res) => {
  res.render('home');
});
app.use(passport.initialize());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
