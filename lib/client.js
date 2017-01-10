'use strict';

const validateOptions = options => {
  if(!options) {
    throw new Error('Options are not specified.');
  } else if(!options.baseUrl) {
    throw new Error(`'baseUrl' option is not specified.`);
  } else if(!options.username) {
    throw new Error(`'username' option is not specified.`);
  } else if(!options.password) {
    throw new Error(`'password' option is not specified.`);
  }
}

const Client = function Client(options) {
  validateOptions(options);

  const https = require('./https')(options.baseUrl, options.username, options.password);
  const self = this || {};

  self.branchPermissions = require('./api/branch-permissions')(https);
  self.branchingModel = require('./api/branching-model')(https);
  return self;
};

module.exports = Client;
