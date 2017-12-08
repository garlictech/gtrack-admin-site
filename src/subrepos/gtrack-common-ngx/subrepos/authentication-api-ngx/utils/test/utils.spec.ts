import { type } from '../';

describe('Utils', () => {
  it("should return the type's label", () => {
    let label = type('test');
    expect(label).toEqual('test');
  });

  it('should guarantee type uniqueness', done => {
    try {
      type('test');
      type('test');
    } catch (e) {
      done();
      return;
    }

    done.fail(new Error('Not failed'));
  });
});
