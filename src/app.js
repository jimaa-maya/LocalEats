require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const connectToMongo = require('./db/connection');
require('./middleware/passport-setup');
const apiRoutes = require('./routes');

const app = express();
const port = 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(passport.initialize());

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on ${port}`);
  connectToMongo();
});
app.use(cookieParser());
app.use('/api', apiRoutes);
app.get('/', (req, res) => {
  res.render('home');
});

module.exports = { app };
