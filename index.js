const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
require('./models/Blog');
require('./services/passport');
require('./services/cache');

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const app = express();

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

if (['production', 'ci'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});

/*
  "dependencies": {
    "aws-sdk": "^2.188.0",
    "body-parser": "^1.17.2",
    "concurrently": "^3.5.0",
    "cookie-session": "^2.0.0-beta.2",
    "express": "^4.15.3",
    "jest": "^22.1.4",
    "migrate-mongoose": "^3.2.2",
    "mongoose": "^4.11.1",
    "nodemon": "^1.11.0",
    "passport": "^0.3.2",
    "passport-google-oauth20": "^2.0.0",
    "path-parser": "^2.0.2",
    "puppeteer": "^1.0.0",
    "redis": "^3.1.2",
    "uuid": "^3.2.1"
  }
*/
