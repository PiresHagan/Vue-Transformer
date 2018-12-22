const vueshiftMode = require('./vue-adapter');

module.exports = adapt;

function adapt(transform) {
  return vueshiftMode(transform);
}