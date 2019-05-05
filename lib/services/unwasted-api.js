// keep file names consistent. Either camel case or kabob case.
// this file isn't middleware it is a service.
const request = require('superagent');

const BASE_URL = 'https://unwasted.herokuapp.com/api/v1/listings/keyword?searchTerm=';

// call input searchTerm for clarity
function getUnwasted(searchTerm) {
  return request
    .get(`${BASE_URL}${searchTerm}`)
    .then(res => res.body);
}

module.exports = getUnwasted;
