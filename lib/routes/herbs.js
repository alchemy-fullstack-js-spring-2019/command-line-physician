const { Router } = require('express');
const { ensureAuth } = require('../middleware/ensure-auth');
const herbMiddleware = require('../middleware/herb-finder');
const Herb = require('../models/Herb');
const unwastedHerbMiddleware = require('../../lib/middleware/unwasted-herb');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const {
      name,
      category,
      latin_name,
      medicinal_uses,
      description,
    } = req.body;

    // use the authenticated user here. Don't trust the post body for
    // user info. That would leave the door open to create an herb on
    // behalf of another user.
    Herb
      .create({ name, latin_name, category, medicinal_uses, description, user: req.user._id })
      .then(createdHerb => res.send(createdHerb))
      .catch(next);
  })

  .get('/top-contributors', (req, res, next) => {
    // don't get lazy. Spell out your words.
    // Future people will thank you
    Herb
      .topContributor()
      .then(topContributor => res.send(topContributor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Herb
      .find()
      .select({
        __v: false,
      })
      .lean()
      .then(herb => res.send(herb))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    const { id } = req.params;
    Herb
      .findById(id)
      .select({
        __v: false
      })
      .lean()
      .then(herb => res.send(herb))
      .catch(next);
  })

  .get('/latin-name/:latin_name', (req, res, next) => {
    const { latin_name } = req.params;

    Herb
      .findOne({ latin_name })
      .select({
        __v: false
      })
      .lean()
      .then(herb => res.send(herb))
      .catch(next);
  })

  .get('/findUnwastedHerbs/:name', unwastedHerbMiddleware, (req, res, next) => {
    const { name } = req.params;
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).trim();

    Herb
      .findOne({ name: formattedName })
      .select({
        __v: false,
      })
      .lean()
      .then(herb => {
        const unwastedHerbs = req.unwasted;
        res.send({ unwastedHerbs, herb });
      })
      .catch(next);
  })

  .get('/common-name/:name', herbMiddleware, (req, res, next) => {
    const { name } = req.params;
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).trim();

    Herb
      .findOne({ name: formattedName })
      .select({
        __v: false
      })
      .lean()
      .then(herb => {
        const herbStores = req.stores;
        res.send({ herbStores, herb });
      })
      .catch(next);
  })

  .patch('/:id', ensureAuth, (req, res, next) => {
    Herb
      .findOneAndUpdate(req.params.id, {
        name: req.body.name,
        category: req.body.category,
        latin_name: req.body.latin_name,
        medicinal_uses: req.body.medicinal_uses,
        description: req.body.description,
      }, { new: true })
      .select({
        __v: false
      })
      .lean()
      .then(herb => res.send(herb))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Herb
      .findByIdAndDelete(req.params.id)
      .select({
        __v: false
      })
      .lean()
      .then(herb => res.send(herb))
      .catch(next);
  });
