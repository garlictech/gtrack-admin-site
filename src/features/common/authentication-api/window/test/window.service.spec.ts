import { WindowService } from '../window.service';

describe('WindowService', () => {
  it('should return window', () => {
    const windowService: WindowService = new WindowService();
    expect(windowService.nativeWindow).toEqual(window);
  });
});
