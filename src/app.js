require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const connectToMongo = require('./db/connection');
require('./middleware/passport-setup');
const apiRoutes = require('./routes');

const app = express();
const port = 3000;

// storage config
const storage = multer.memoryStorage(); // Using memory storage to store file buffers
const upload = multer({ storage });

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(passport.initialize());
app.use(upload.single('image'));

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

module.exports = { app, storage };
