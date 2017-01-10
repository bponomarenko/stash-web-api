'use strict';

const Promise = require('promise');
const handleError = require('./utils').handleError;

const BranchingApiFactory = https => {
  const getUrl = (projectKey, repo) => `/rest/branch-utils/latest/projects/${projectKey}/repos/${repo}/branchmodel/configuration`;

  const disableBranchingModel = (projectKey, repo) => https.delete(getUrl(projectKey, repo))
    .catch(handleError);

  const enableBranchingModel = (projectKey, repo) => https.put(getUrl(projectKey, repo))
    .catch(handleError);

  const getBranchingModel = (projectKey, repo) => https.get(getUrl(projectKey, repo))
    .catch(handleError);

  return {
    get: getBranchingModel,
    disable: disableBranchingModel,
    enable: enableBranchingModel
  };
};

module.exports = BranchingApiFactory;
