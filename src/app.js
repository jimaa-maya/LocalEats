require('dotenv').config();
const express = require('express');
const passport = require('passport');
const connectToMongo = require('./db/connection');
const cookieParser = require('cookie-parser');
require('./middleware/passport-setup');
const apiRoutes = require('./routes');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cart = require('./models/cart');

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

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Local eat API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Your Name",
        url: "https://re-coded.com",
        email: "youremail@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  
  apis: [`src/routes/cart.js`],
  apis: [`src/routes/users.js`],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;