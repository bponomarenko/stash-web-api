'use strict';

const Promise = require('promise');

module.exports = (() => {
  let getCallback = () => Promise.resolve();

  return {
    // mock methods
    get: options => getCallback(options),

    // helper methods
    setGetCallback: callback => { getCallback = callback; }
  };
})();
