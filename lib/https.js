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
    let errStr;
    let body = '';

    if(res.statusCode >= 400) {
      errStr = `Request to ${res.url || res.req.path} failed with HTTP ${res.statusCode}`;
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

      if(errStr) {
        console.log(errStr);
        reject(parsedBody || body)
      } else {
        resolve(parsedBody || body);
      }
    });
  };

  const request = (options, data) => {
    return new Promise((resolve, reject) => {
      const opts = Object.assign({}, baseOpts, options);
      const req = https.request(opts, res => callback(res, resolve, reject, opts.json));

      req.on('error', reject);

      if(data) {
        req.write(data);
      }
      req.end();
    });
  };

  const writeRequest = (method, path, data) => {
    const postData = JSON.stringify(data || {});
    return request({
      method: method,
      path,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);
  };

  return {
    get: path => request({ path }),
    post: (path, data) => writeRequest('POST', path, data),
    put: (path, data) => writeRequest('PUT', path, data),
    delete: path => request({ path, method: 'DELETE', json: false })
  };
};

module.exports = HttpsFactory;
