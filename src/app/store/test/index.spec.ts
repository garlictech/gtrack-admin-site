import * as Store from '../index';

describe('Store index', () => {
  it('should get reducers', () => {
    const expected = Store.getReducers();

    expect(expected).toEqual(Store.reducer);
  });
});
