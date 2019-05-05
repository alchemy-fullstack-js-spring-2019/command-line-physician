// keep file names consistent. Either camel case or kabob case.
const getUnwasted = require('../services/unwasted-api');

const unwastedHerbMiddleware = (req, res, next) => {
  const { name } = req.params;
  return getUnwasted(name)
    .then(unwastedHerbs => {
      // no need to use a Promise.all here since
      // we are not waiting for a promise. Also,
      // map returns an array, so no need to push
      // to an array
      req.unwasted = unwastedHerbs.map(herb => ({
        unwastedTitle: herb.title,
        unwastedPostedDate: herb.postedDate,
        unwastedExpiration: herb.expiration,
        unwastedUser: herb.user
      }));
      next();
    });
};

module.exports = unwastedHerbMiddleware;
