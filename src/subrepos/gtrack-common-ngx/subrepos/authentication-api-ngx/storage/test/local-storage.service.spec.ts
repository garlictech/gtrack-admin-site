import { LocalStorage } from '../local-storage.service';

describe('LocalStorage', () => {
  let store: any = {};

  beforeEach(() => {
    spyOn(window.localStorage, 'getItem').and.callFake(key => {
      return store[key];
    });

    spyOn(window.localStorage, 'setItem').and.callFake((key, value) => {
      store[key] = value;
    });

    spyOn(window.localStorage, 'removeItem').and.callFake(key => {
      delete store[key];
    });

    spyOn(window.localStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  afterEach(() => {
    store = {};
  });

  it('should set item', () => {
    let service = new LocalStorage();
    service.setItem('test', '1');

    expect(store.test).toEqual('1');
  });

  it('should get item', () => {
    let service = new LocalStorage();
    service.setItem('test', '1');
    expect(service.getItem('test')).toEqual('1');
  });

  it('should delete item', () => {
    let service = new LocalStorage();
    service.setItem('test', '1');

    expect(store.test).toEqual('1');
    service.removeItem('test');

    expect(store.test).toBeFalsy();
  });

  it('should remove all', () => {
    let service = new LocalStorage();
    service.setItem('test', '1');
    service.setItem('test2', '2');
    service.setItem('test3', '3');
    service.clear();

    expect(Object.keys(store).length).toEqual(0);
  });
});
