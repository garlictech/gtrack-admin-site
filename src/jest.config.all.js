var globalConf = require('../jest.config.all');
var localConf = require('./jest.config');

module.exports = {
  ...globalConf,
  ...localConf
};
