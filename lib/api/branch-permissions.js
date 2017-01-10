'use strict';

const Promise = require('promise');

const PermissionsApiFactory = https => {
  const getOrCreateCollection = (restriction, typeKey) => {
    const collectionKey = `${typeKey}s`;
    if(!restriction[collectionKey]) {
      restriction[collectionKey] = [];
    }
    return restriction[collectionKey];
  };

  const handleError = error => {
    if(error && error.errors && error.errors instanceof Array) {
      error = error.errors.map(err => err.message) || error;
    }
    return Promise.reject(error);
  };

  const getPermissions = (projectKey, repo) => {
    const baseUrl = `/rest/branch-permissions/latest/projects/${projectKey}/repos/${repo}`;

    return Promise.all([
      https.get(`${baseUrl}/restricted`),
      https.get(`${baseUrl}/permitted`)
    ])
    .then(res => {
      const restricted = res[0].values;
      const permitted = res[1].values;

      // Combine information from restricted and permitted arrays
      restricted.forEach(restriction => permitted
        .filter(permission => permission.restrictedId === restriction.id)
        .forEach(permission => {
          Object.keys(permission || {}).forEach(key => {
            if(key === 'user' || key === 'group') {
              // Create new or use existing collection, and push permission user/group to it
              getOrCreateCollection(restriction, key).push(permission[key]);
            }
          })
        })
      );

      return restricted;
    })
    .catch(handleError);
  };

  const addPermission = (projectKey, repo, permission) => {
    if(!permission) {
      return Promise.reject('Permission object should be defined');
    }

    const url = `/rest/branch-permissions/latest/projects/${projectKey}/repos/${repo}/restricted`;
    const data = {
      type: permission.branch ? 'BRANCH' : 'PATTERN',
      value: permission.branch ? `refs/heads/${permission.branch}` : permission.pattern,
      users: [].concat(permission.users || []),
      groups: [].concat(permission.groups || [])
    };

    return https.post(url, data)
      .catch(handleError);
  };

  const removePermission = (projectKey, repo, permissionId) => {
    const url = `/rest/branch-permissions/latest/projects/${projectKey}/repos/${repo}/restricted/${permissionId}`;
    return https.delete(url)
      .catch(handleError);
  };

  return {
    get: getPermissions,
    add: addPermission,
    remove: removePermission
  };
};

module.exports = PermissionsApiFactory;
