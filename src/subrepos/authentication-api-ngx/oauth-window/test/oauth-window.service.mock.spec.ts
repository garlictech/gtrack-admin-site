import { WindowService } from '../../window';
import { OauthWindowMockService } from './oauth-window.service.mock';

describe('OauthWindowMockService', () => {
  let service: OauthWindowMockService;

  beforeEach(() => {
    let windowService: WindowService = new WindowService();
    service = new OauthWindowMockService(windowService);
  });

  it('should return a promise when opened', () => {
    expect(
      service.open('http://test.com', 'access_token') instanceof Promise
    ).toBeTruthy();
  });

  it('should change url', done => {
    service.callback = (url: string) => {
      done();
    };

    service.open('http://test.com');
    service.changeUrl('http://test.com?test=1');
  });

  it('should have dummy close', () => {
    service.close();
  });

  it('should have dummy callback', () => {
    service.callback('http://twitter.com');
  });
});
