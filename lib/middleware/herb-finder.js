// keep file names consistent. Either camel case or kabob case.
// no need to configure dotenv, rely on server.js to configure
// dotenv.
const getStores = require('../services/google-api');

const herbMiddleware = (req, res, next) => {
  const { name } = req.params;
  return getStores(name)
    .then(herbInfo => {
      // no need to use a Promise.all here since
      // we are not waiting for a promise. Also,
      // map returns an array, so no need to push
      // to an array
      req.store = herbInfo.map(herbStore => ({
        storeName: herbStore.name,
        storeAddress: herbStore.formatted_address
      }));

      next();
    });
};

module.exports = herbMiddleware;
