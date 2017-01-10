'use strict';

const apiFactory = require('../../lib/api/branch-permissions');

const https = jasmine.createSpyObj('https', ['get']);

describe('Branch Permissions', () => {
  it('should be factory with api methods', () => {
    expect(apiFactory).toBeFunction();

    const api = apiFactory(https);
    expect(api).toBeObject();
    expect(api.get).toBeFunction();
  });

 describe('Get method', () => {
    let api;

    beforeEach(() => {
      api = apiFactory(https);
    });

    it('should make two calls and return successful promise on success', done => {
      https.get.and.returnValue(Promise.resolve({ values: [] }));

      api.get('projectKey', 'repositoryKey')
        .catch(done.fail)
        .then(res => {
          expect(res).toBeEmptyArray();
          expect(https.get).toHaveBeenCalledWith('/rest/branch-permissions/latest/projects/projectKey/repos/repositoryKey/restricted');
          expect(https.get).toHaveBeenCalledWith('/rest/branch-permissions/latest/projects/projectKey/repos/repositoryKey/permitted');
        })
        .then(done);
    });

    it('should return failed promise on failure', done => {
      https.get.and.callFake(url => url.includes('permitted') ? Promise.reject('fake error') : Promise.resolve({ values: [] }));

      api.get('projectKey', 'repositoryKey')
        .then(done.fail)
        .catch(error => {
          expect(error).toEqual('fake error');
        })
        .then(done);
    });

    it('should return successful promise with merged arrays', done => {
      const permittedData = {
        values: [
          { restrictedId: 1, user: 'someuser' },
          { restrictedId: 1, user: 'another user' },
          { restrictedId: 2, group: 'somegroup' },
          { restrictedId: 2, user: 'yet another user' },
          { restrictedId: 3, data: 'fakedata' }
        ]
      };
      const restrictedData = {
        values: [
          { id: 1, index: 'one' },
          { id: 2, index: 'two' },
          { id: 3, index: 'three' }
        ]
      };

      https.get.and.callFake(url => Promise.resolve(url.includes('permitted') ? permittedData : restrictedData));

      api.get('projectKey', 'repositoryKey')
        .catch(done.fail)
        .then(res => {
          expect(res).toEqual([
            { id: 1, index: 'one', users: ['someuser', 'another user'] },
            { id: 2, index: 'two', users: ['yet another user'], groups: ['somegroup'] },
            { id: 3, index: 'three' }
          ]);
        })
        .then(done);
    });
  });
});
