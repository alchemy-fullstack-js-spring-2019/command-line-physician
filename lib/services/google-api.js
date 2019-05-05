// keep file names consistent. Either camel case or kabob case.
// no need to configure dotenv, rely on server.js to configure
// dotenv.

// You probably want to mock this file for testing
const request = require('superagent');

const BASE_URL = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${process.env.GOOGLE_KEY}&inputtype=textquery&fields=formatted_address,name,geometry&`;

function getStores(input) {
  return request
    .get(`${BASE_URL}input=${input}%20Portland%20Oregon`)
    .then(res => res.body.candidates);
}

module.exports = getStores;
