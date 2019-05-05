const { Router } = require('express');
const { ensureAuth } = require('../middleware/ensure-auth');
const Favorite = require('../../lib/models/Favorite');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      herb
    } = req.body;
    Favorite
      .create({
        // use the authenticated user here. Don't trust the post body for
        // user info. That would leave the door open to create a favorite on
        // behalf of another user.
        user: req.user._id,
        herb
      })
      .then(createdFave => res.send(createdFave))
      .catch(next);
  })

  .get('/', ensureAuth, (req, res, next) => {
    // you can only get your favorites not another users favorites
    Favorite
      .find({ user: req.user._id })
      .select({ __v: false })
      .lean()
      .then(faves => {
        res.send(faves);
      })
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    // Make sure the user owns the favorite they are trying to delete
    Favorite
      .findOneAndDelete({ _id: req.params.id, user: req.user._id })
      .select({
        __v: false
      })
      .lean()
      .then(deletedFave => res.send(deletedFave))
      .catch(next);
  });
