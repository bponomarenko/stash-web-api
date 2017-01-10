'use strict';

const Promise = require('promise');
const handleError = require('./utils').handleError;

const PermissionsApiFactory = https => {
  const getOrCreateCollection = (restriction, typeKey) => {
    const collectionKey = `${typeKey}s`;
    if(!restriction[collectionKey]) {
      restriction[collectionKey] = [];
    }
    return restriction[collectionKey];
  };

  const getPermissionRequestData = data => ({
    type: data.branch ? 'BRANCH' : 'PATTERN',
    value: data.branch ? `refs/heads/${data.branch}` : data.pattern,
    users: [].concat(data.users || []),
    groups: [].concat(data.groups || [])
  });

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

  const addPermission = (projectKey, repo, data) => {
    if(!data) {
      return Promise.reject('Permission data should be defined');
    }

    const url = `/rest/branch-permissions/latest/projects/${projectKey}/repos/${repo}/restricted`;
    const postData = getPermissionRequestData(data);

    return https.post(url, postData)
      .catch(handleError);
  };

  const removePermission = (projectKey, repo, permissionId) => {
    const url = `/rest/branch-permissions/latest/projects/${projectKey}/repos/${repo}/restricted/${permissionId}`;
    return https.delete(url)
      .catch(handleError);
  };

  const updatePermission = (projectKey, repo, permissionId, data) => {
    if(!permissionId) {
      return Promise.reject('Permission ID should be defined');
    } else if (!data) {
      return Promise.reject('Permission data should be defined');
    }

    const url = `/rest/branch-permissions/latest/projects/${projectKey}/repos/${repo}/restricted/${permissionId}`;
    const putData = getPermissionRequestData(data);

    return https.put(url, putData)
      .catch(handleError);
  };

  return {
    getAll: getPermissions,
    add: addPermission,
    update: updatePermission,
    remove: removePermission
  };
};

module.exports = PermissionsApiFactory;
