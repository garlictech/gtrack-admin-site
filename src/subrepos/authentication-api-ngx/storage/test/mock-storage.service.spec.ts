import { MockStorageService } from './mock-storage.service';

describe('MockStorageService', () => {
  let store: any = {};

  it('should set item', () => {
    let service = new MockStorageService();
    service.setItem('test', '1');
    expect(service.getItem('test')).toEqual('1');
  });

  it('should delete item', () => {
    let service = new MockStorageService();
    service.setItem('test', '1');
    expect(service.getItem('test')).toEqual('1');
    service.removeItem('test');
    expect(service.getItem('test')).toBeFalsy();
  });

  it('should remove all', () => {
    let service = new MockStorageService();
    service.setItem('test', '1');
    service.setItem('test2', '2');
    service.setItem('test3', '3');
    service.clear();

    expect(service.getItem('test')).toBeFalsy();
    expect(service.getItem('test2')).toBeFalsy();
    expect(service.getItem('test3')).toBeFalsy();
  });
});
