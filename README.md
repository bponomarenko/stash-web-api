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

##### #getAll

Get all branch permissions for a repository:

```javascript
stashApi.branchPermissions.getAll(projectKey, repositorySlug); // Returns Promise
```

##### #add

Add new branch permission for a repository:

```javascript
var permission = {
  branch: 'branch_name',
  users: 'super_user',
  groups: ['development', 'admins']  
};

stashApi.branchPermissions.add(projectKey, repositorySlug, permission); // Returns Promise
```

Permission object should be defined and should contain:
* __branch__ property (if __pattern__ is not defined), which should contain branch name to apply permission to.
* __pattern__ property (if __branch__ is not defined), which should contain pattern to match multiple branches.
* __users__ property (optional). Should be a name or an array of user names to aply permission to.
* __groups__ property (optional). Should be a group name or an array of user groups to aply permission to.

##### #update

Update existing branch permission on a repository:

```javascript
var permission = {
  branch: 'branch_name',
  users: 'super_user',
  groups: ['development', 'admins']  
};

stashApi.branchPermissions.update(projectKey, repositorySlug, permissionId, permission); // Returns Promise
```

Permission object should be defined and should contain:
* __branch__ property (if __pattern__ is not defined), which should contain branch name to apply permission to.
* __pattern__ property (if __branch__ is not defined), which should contain pattern to match multiple branches.
* __users__ property (optional). Should be a name or an array of user names to aply permission to.
* __groups__ property (optional). Should be a group name or an array of user groups to aply permission to.

_Note that permission type (replace __branch__  property with __pattern__, and vise versa) of the initial permission shouldn't be done. Otherwise it might lead to unexpected results._

##### #remove

Delete existing branch permision on a repository:

```javascript
stashApi.branchPermissions.remove(projectKey, repositorySlug, permissionId); // Returns Promise
```

## License

MIT
