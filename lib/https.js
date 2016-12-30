'use strict';

const url = require('url');
const https = require('https');
const Promise = require('promise');

const HttpsFactory = (baseUrl, username, password) => {
  const parsedUrl = url.parse(baseUrl);
  const baseOpts = {
    method: 'GET',
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    auth: `${username}:${password}`,
    json: true
  };

  const callback = (res, resolve, reject, json) => {
    let body = '';

    if(res.statusCode >= 400) {
      reject(`Request to ${res.url} failed with HTTP ${res.statusCode}`);
      return;
    }

    res.on('data', chunk => {
      body += chunk.toString();
    });

    res.on('end', () => {
      let parsedBody;
      if(json) {
        try {
          parsedBody = JSON.parse(body);
        } catch(err) {
          console.log('Unable to parse response to JSON object.');
        }
      }

      resolve(parsedBody || body);
    });
  };

  const request = options => {
    return new Promise((resolve, reject) => {
      const opts = Object.assign({}, baseOpts, options);
      const req = https.request(opts, res => callback(res, resolve, reject, opts.json));

      req.on('error', reject);
      req.end();
    });
  };

  return {
    get: path => request({ path })
  };
};

module.exports = HttpsFactory;
