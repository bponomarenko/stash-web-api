'use strict';

const apiFactory = require('../../lib/api/branch-permissions');

describe('Branch Permissions:', () => {
  let https;

  beforeEach(() => {
    https = jasmine.createSpyObj('https', ['get', 'post', 'delete', 'put']);
  });

  it('should be factory with api methods', () => {
    expect(apiFactory).toBeFunction();
    expect(apiFactory(https)).toBeObject();
  });

  it('should have limited set of methods', () => {
    const api = apiFactory(https);
    expect(Object.keys(api).length).toEqual(3);
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

    it('should return array of error messages for well formed error objects', done => {
      https.get.and.returnValue(Promise.reject({
        errors: [
          { message: 'Error message' },
          { message: 'More errors' }
        ]
      }));

      api.get()
        .then(done.fail)
        .catch(err => {
          expect(err).toEqual(['Error message', 'More errors']);
        })
        .then(done);
    });
  });

  describe('Add method', () => {
    let api;

    beforeEach(() => {
      api = apiFactory(https);
    });

    it('should make POST call with correct params and return resolved Promise on success', done => {
      https.post.and.returnValue(Promise.resolve('successful response'));

      api.add('test', 'test', {})
        .catch(done.fail)
        .then(res => {
          expect(res).toEqual('successful response');
          expect(https.post).toHaveBeenCalledWith(
            '/rest/branch-permissions/latest/projects/test/repos/test/restricted',
            jasmine.any(Object)
          );
        })
        .then(done);
    });

    it('should check for permission object and fail if not it`s not present', done => {
      https.post.and.returnValue(Promise.resolve('successful response'));

      api.add('test', 'test')
        .then(done.fail)
        .catch(err => {
          expect(err).toEqual('Permission object should be defined');
          expect(https.post).not.toHaveBeenCalled();
        })
        .then(done);
    });

    it('should transform branch permission object to correct request data object', done => {
      https.post.and.returnValue(Promise.resolve());

      api.add('test', 'test', {
        branch: 'stash branch'
      })
        .catch(done.fail)
        .then(res => {
          // Check second argument only, which is post data object
          expect(https.post.calls.argsFor(0)[1]).toEqual({
            type: 'BRANCH',
            value: 'refs/heads/stash branch',
            users: [],
            groups: []
          });
        })
        .then(done);
    });

    it('should transform pattern permission object to correct request data object', done => {
      https.post.and.returnValue(Promise.resolve());

      api.add('test', 'test', {
        pattern: 'pattern*with^wildcards',
        users: 'borys',
        groups: ['developers', 'admins']
      })
        .catch(done.fail)
        .then(res => {
          // Check second argument only, which is post data object
          expect(https.post.calls.argsFor(0)[1]).toEqual({
            type: 'PATTERN',
            value: 'pattern*with^wildcards',
            users: ['borys'],
            groups: ['developers', 'admins']
          });
        })
        .then(done);
    });

    it('should return array of error messages for well formed error objects', done => {
      https.post.and.returnValue(Promise.reject({
        errors: [
          { message: 'Error message' },
          { message: 'More errors' }
        ]
      }));

      api.add('test', 'test', {})
        .then(done.fail)
        .catch(err => {
          expect(err).toEqual(['Error message', 'More errors']);
        })
        .then(done);
    });
  });

  describe('Remove method', () => {
    let api;

    beforeEach(() => {
      api = apiFactory(https);
    });

    it('should make delete call for permissionID', done => {
      https.delete.and.returnValue(Promise.resolve());

      api.remove('projectKey', 'repositoryKey', 1234)
        .catch(done.fail)
        .then(res => {
          expect(res).toBeUndefined();
          expect(https.delete).toHaveBeenCalledWith('/rest/branch-permissions/latest/projects/projectKey/repos/repositoryKey/restricted/1234');
        })
        .then(done);
    });

    it('should return rejected Promise when delete fails', done => {
      https.delete.and.returnValue(Promise.reject());

      api.remove()
        .then(done.fail)
        .catch(err => {
          expect(err).toBeUndefined();
          expect(https.delete).toHaveBeenCalledWith('/rest/branch-permissions/latest/projects/undefined/repos/undefined/restricted/undefined');
        })
        .then(done);
    });

    it('should return not parsed error for non-error objects', done => {
      https.delete.and.returnValue(Promise.reject('Some random error'));

      api.remove()
        .then(done.fail)
        .catch(err => {
          expect(err).toEqual('Some random error');
        })
        .then(done);
    });

    it('should return array of error messages for well formed error objects', done => {
      https.delete.and.returnValue(Promise.reject({
        errors: [
          { message: 'Error message' },
          { message: 'More errors' }
        ]
      }));

      api.remove()
        .then(done.fail)
        .catch(err => {
          expect(err).toEqual(['Error message', 'More errors']);
        })
        .then(done);
    });
  });
});
