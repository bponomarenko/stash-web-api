# NodeJS client for Atlassian Stash

Provides access to some of the Stash's API which is not available with official REST API and was only accessible throw the Web interface.

[![Build Status](https://travis-ci.org/bponomarenko/stash-web-api.svg?branch=master)](https://travis-ci.org/bponomarenko/stash-web-api)
[![Coverage Status](https://coveralls.io/repos/github/bponomarenko/stash-web-api/badge.svg?branch=master)](https://coveralls.io/github/bponomarenko/stash-web-api?branch=master)

Tested with Atlassian Stash v3.5.1

## Usage

```javascript
var Client = require('stash-web-api').Client;

var stashApi = new Client({
  username: 'username',
  password: 'password',
  baseUrl: 'https://stash.yourcompany.com'
});
```

## API

### Repository branch permissions

Get all branch permissions for a repository:

```javascript
stashApi.branchPermissions.get(projectKey, repositorySlug); // Returns Promise
```

## License

MIT
