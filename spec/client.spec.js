const Client = require('../lib/client');

const options = {
  baseUrl: 'some value',
  username: 'some value',
  password: 'some value'
};

describe('Client', () => {
  it('should be constructor and factory function', () => {
    expect(Client).toBeFunction();
    expect(new Client(options)).toBeObject();
    expect(Client(options)).toBeObject();
  });

  it('should have properties with api', () => {
    const client = new Client(options);
    const apiKeys = Object.keys(client);

    expect(apiKeys.length).toEqual(1);
    expect(client['branchPermissions']).toBeObject();
  });

  it('should have validation for options', () => {
    expect(() => new Client()).toThrow();
    expect(() => new Client(123)).toThrow();
    expect(() => new Client({})).toThrow();
    expect(() => new Client({ baseUrl: null, username: null, password: null })).toThrow();
    expect(() => new Client({ baseUrl: '123' })).toThrow();
    expect(() => new Client({ username: '123', password: '123' })).toThrow();
    expect(() => new Client({ username: '123', baseUrl: '123' })).toThrow();
    expect(() => new Client({ username: '123', password: '123', baseUrl: '123' })).not.toThrow();
  });
});
