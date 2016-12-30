const lib = require('../index');

describe('stash-web-api', () => {
  it('should contain Client constructor', () => {
    expect(lib).toBeObject();
    expect(lib.Client).toBeFunction();
  });
});
