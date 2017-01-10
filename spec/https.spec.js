'use strict';

const HttpsFactory = require('../lib/https');

describe('https factory:', () => {
  it('should be a function, which returns object', () => {
    expect(HttpsFactory).toBeFunction();

    const https = HttpsFactory('');
    expect(https).toBeObject();
    expect(https.get).toBeFunction();
    expect(https.post).toBeFunction();
    expect(https.put).toBeFunction();
    expect(https.delete).toBeFunction();

    // Check expected error when baseUrl is not set
    expect(HttpsFactory).toThrow();
  });
});
