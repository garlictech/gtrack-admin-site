import { WindowService } from '../window.service';

describe('WindowService', () => {
  it('should return window', () => {
    let windowService: WindowService = new WindowService();
    expect(windowService.nativeWindow).toEqual(window);
  });
});
