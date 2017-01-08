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

    it('should make two calls and return successful promise', done => {
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

    it('should return failed promise', done => {
      https.get.and.callFake(url => url.includes('permitted') ? Promise.reject('fake error') : Promise.resolve({ values: [] }));

      api.get('projectKey', 'repositoryKey')
        .then(done.fail)
        .catch(error => {
          expect(error).toEqual('fake error');
        })
        .then(done);
    });

    it('should return successful promise', done => {
      const permittedData = {
        values: [
          { restrictedId: 1, user: 'someuser' },
          { restrictedId: 2, group: 'somegroup' },
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
            { id: 1, index: 'one', user: 'someuser' },
            { id: 2, index: 'two', group: 'somegroup' },
            { id: 3, index: 'three' }
          ]);
        })
        .then(done);
    });
  });
});
