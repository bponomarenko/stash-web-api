'use strict';

const apiFactory = require('../../lib/api/branching-model');

describe('Branching Model:', () => {
  let https;

  beforeEach(() => {
    https = jasmine.createSpyObj('https', ['get', 'delete', 'put']);
  });

  it('should be factory with api methods', () => {
    expect(apiFactory).toBeFunction();
    expect(apiFactory(https)).toBeObject();
  });

  it('should have limited set of methods', () => {
    const api = apiFactory(https);
    expect(Object.keys(api).length).toEqual(3);
  });

  describe('Get method:', () => {
    let api;

    beforeEach(() => {
      api = apiFactory(https);
    });

    it('should return resolved Promise on success', done => {
      https.get.and.returnValue(Promise.resolve('success'));

      api.get('test', 'test')
        .catch(done.fail)
        .then(res => {
          expect(res).toEqual('success');
          expect(https.get).toHaveBeenCalledWith('/rest/branch-utils/latest/projects/test/repos/test/branchmodel/configuration');
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

  describe('Enable method:', () => {
    let api;

    beforeEach(() => {
      api = apiFactory(https);
    });

    it('should return resolved Promise on success', done => {
      https.put.and.returnValue(Promise.resolve('success'));

      api.enable('test', 'test')
        .catch(done.fail)
        .then(res => {
          expect(res).toEqual('success');
          expect(https.put).toHaveBeenCalledWith('/rest/branch-utils/latest/projects/test/repos/test/branchmodel/configuration');
        })
        .then(done);
    });

    it('should return array of error messages for well formed error objects', done => {
      https.put.and.returnValue(Promise.reject({
        errors: [
          { message: 'Error message' },
          { message: 'More errors' }
        ]
      }));

      api.enable()
        .then(done.fail)
        .catch(err => {
          expect(err).toEqual(['Error message', 'More errors']);
        })
        .then(done);
    });
  });

  describe('Disable method:', () => {
    let api;

    beforeEach(() => {
      api = apiFactory(https);
    });

    it('should return resolved Promise on success', done => {
      https.delete.and.returnValue(Promise.resolve('success'));

      api.disable('test', 'test')
        .catch(done.fail)
        .then(res => {
          expect(res).toEqual('success');
          expect(https.delete).toHaveBeenCalledWith('/rest/branch-utils/latest/projects/test/repos/test/branchmodel/configuration');
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

      api.disable()
        .then(done.fail)
        .catch(err => {
          expect(err).toEqual(['Error message', 'More errors']);
        })
        .then(done);
    });
  });
});
