const filterByUserId = require('../../src/jsonapi/filterByUserId');

describe('filterByUserId', () => {
  it('adds an userId filte', async () => {
    expect(filterByUserId({ param: 42, test: 'regis' }, '42')).toEqual({
      param: 42,
      test: 'regis',
      'filter[userId]': '42'
    });
  });
});
