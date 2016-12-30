'use strict';

const PermissionsApiFactory = https => {
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
      restricted.forEach(restriction => {
        const permission = permitted.find(permission => permission.restrictedId === restriction.id);
        Object.keys(permission || {}).forEach(key => {
          if(key === 'user' || key === 'group') {
            restriction[key] = permission[key];
          }
        })
      });

      return restricted;
    });
  };

  return {
    get: getPermissions
  };
};

module.exports = PermissionsApiFactory;
