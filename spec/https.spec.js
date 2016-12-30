'use strict';

const mock = require('mock-require');
const httpsMock = require('./mock/https');
mock('https', httpsMock);

const HttpsFactory = require('../lib/https');

describe('https factory', () => {
  beforeEach(() => {
    httpsMock.setGetCallback(() => Promise.resolve());
  });

  it('should be a function, which returns object', () => {
    expect(HttpsFactory).toBeFunction();

    const https = HttpsFactory('');
    expect(https).toBeObject();
    expect(https.get).toBeFunction();

    expect(HttpsFactory).toThrow();
  });

  describe('get', () => {
    it('should return promise with data on success', done => {
      done();
    });
  });
});
