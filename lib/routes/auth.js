const { Router } = require('express');
const { ensureAuth } = require('../middleware/ensure-auth');
const User = require('../models/User');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      email,
      password,
      profilePhoto
    } = req.body;
    User
      .create({ email, password, profilePhoto })
      .then(user => {
        const token = user.createToken();
        res.send({ user, token });
      })
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const {
      email,
      password
    } = req.body;

    User
      .findOne({ email })
      .then(user => {
        if(!user) {
          // Make both email and password messages the same.
          // This helps improve security because potential
          // hackers won't know if they messed up the email
          // or password portion of the authentication.
          const error = new Error('Invalid authentication!');
          error.status = 401;
          return next(error);
        }
        return Promise.all([
          Promise.resolve(user),
          user.compare(password)
        ]);
      })
      .then(([user, result]) => {
        if(!result) {
          const error = new Error('Invalid authentication!');
          error.status = 401;
          return next(error);
        } else {
          res.send({
            token: user.createToken(),
            user
          });
        }
      });
  })
  .get('/verify', ensureAuth, (req, res, next) => {
    res.send(req.user);
    next();
  });
