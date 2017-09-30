import { Deferred } from '../';

describe('Deffered', () => {
  it('should resolved after resolve', done => {
    let deferred: Deferred = new Deferred();
    expect(deferred.promise instanceof Promise).toBeTruthy();

    deferred.promise
      .then(data => {
        expect(data).toEqual('test');
        done();
      })
      .catch(err => done.fail(err));

    deferred.resolve('test');
  });

  it('should rejeceted after reject', done => {
    let deferred: Deferred = new Deferred();

    deferred.promise
      .then(() => {
        done.fail(new Error('Resolved'));
      })
      .catch(err => {
        expect(err instanceof Error).toBeTruthy();
        expect(err.message).toEqual('test error');
        done();
      });

    deferred.reject(new Error('test error'));
  });
});
