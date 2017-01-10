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
    });
  };

  return {
    get: getPermissions
  };
};

module.exports = PermissionsApiFactory;
