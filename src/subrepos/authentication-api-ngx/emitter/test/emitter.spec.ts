import { Emitter } from '../';

describe('Emitter', () => {
  let emitter: Emitter;

  beforeEach(() => {
    emitter = new Emitter();
  });

  it('should emit events', done => {
    emitter.on('test', done);
    emitter.emit('test');
  });

  it('should handle multiple events', done => {
    emitter.on('test', () => {
      emitter.emit('test2');
    });

    emitter.on('test2', () => {
      done();
    });

    emitter.emit('test');
  });

  it('should remove event handler', done => {
    emitter.on('test', () => done.fail(new Error('fired')));
    emitter.on('test', () => done.fail(new Error('fired')));

    emitter.off('test');
    emitter.emit('test');

    setTimeout(done, 400);
  });

  it('should not fail with bad event name', done => {
    emitter.off('test-not-exists');
    done();
  });

  it('should remove all event handlers', done => {
    emitter.on('test', () => done.fail(new Error('test fired')));
    emitter.on('test2', () => done.fail(new Error('test2 fired')));
    emitter.on('test2', () => done.fail(new Error('test2 fired')));

    emitter.dispose();
    emitter.emit('test');
    emitter.emit('test2');

    setTimeout(done, 400);
  });
});
