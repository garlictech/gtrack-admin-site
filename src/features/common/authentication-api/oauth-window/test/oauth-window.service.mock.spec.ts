import { Observable } from 'rxjs';
import { OauthWindowMockService } from './oauth-window.service.mock';

describe('OauthWindowMockService', () => {
  let service: OauthWindowMockService;

  beforeEach(() => {
    service = new OauthWindowMockService();
  });

  it('should return an observable when opened', () => {
    expect(service.open('http://test.com', 'access_token') instanceof Observable).toBeTruthy();
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
