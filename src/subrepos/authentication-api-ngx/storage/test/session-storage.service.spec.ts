import { SessionStorage } from '../session-storage.service';

describe('SessionStorage', () => {
  let store: any = {};

  beforeEach(() => {
    spyOn(window.sessionStorage, 'getItem').and.callFake(key => {
      return store[key];
    });

    spyOn(window.sessionStorage, 'setItem').and.callFake((key, value) => {
      store[key] = value;
    });

    spyOn(window.sessionStorage, 'removeItem').and.callFake(key => {
      delete store[key];
    });

    spyOn(window.sessionStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  afterEach(() => {
    store = {};
  });

  it('should set item', () => {
    let service = new SessionStorage();
    service.setItem('test', '1');

    expect(store.test).toEqual('1');
  });

  it('should get item', () => {
    let service = new SessionStorage();
    service.setItem('test', '1');
    expect(service.getItem('test')).toEqual('1');
  });

  it('should delete item', () => {
    let service = new SessionStorage();
    service.setItem('test', '1');

    expect(store.test).toEqual('1');
    service.removeItem('test');

    expect(store.test).toBeFalsy();
  });

  it('should remove all', () => {
    let service = new SessionStorage();
    service.setItem('test', '1');
    service.setItem('test2', '2');
    service.setItem('test3', '3');
    service.clear();

    expect(Object.keys(store).length).toEqual(0);
  });
});
