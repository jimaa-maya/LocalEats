require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectToMongo = require('./db/connection');
require('./middleware/passport-setup');
const apiRoutes = require('./routes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3001;

app.use(express.json());

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(cookieParser(process.env.SECRET_KEY));
app.use(passport.initialize());

// Connect to MongoDB
connectToMongo();

// API Routes
app.use('/api', apiRoutes);
app.use(passport.initialize());
// Home Route
// Attention: when we want to see the ejs dont npm start, go to the folder and node app.js
app.get('/', (req, res) => {
  res.render('home');
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Local eat API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Your Name',
        url: 'https://re-coded.com',
        email: 'youremail@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
      {
        url: 'http://localhost:3000/api/sign',
      },
    ],
  },

  apis: ['src/routes/cart.js', 'src/routes/sign.js', 'src/routes/users.js'],
};

const specs = swaggerJsdoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Local eat API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Your Name',
        url: 'https://re-coded.com',
        email: 'youremail@email.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/',
      },
    ],
  },

  apis: [`src/routes/cart.js`, 'src/routes/dishes.js'],
};

const specs = swaggerJsdoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
});

module.exports = app;
