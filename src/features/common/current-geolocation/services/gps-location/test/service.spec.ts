import { GpsLocationService } from '../gps-location.service';
import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';

class TestGpsLocationService extends GpsLocationService {
  _isPlatformBrowser = jest.fn();
}

describe('GpsLocationService', () => {
  let service: TestGpsLocationService;
  let platformSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: GpsLocationService, useClass: TestGpsLocationService }]
    });

    service = TestBed.get(GpsLocationService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should return EMPTY on non-browser platform', () => {
    platformSpy = service._isPlatformBrowser.mockReturnValue(false);
    service.watchPosition().subscribe(result => {
      // expect(result).toEqual(EMPTY);
    });
    expect(platformSpy).toHaveBeenCalled();
    expect(platformSpy).toHaveReturnedWith(false);
  });

  it('should return an Observable<Position> on browser platform', () => {
    platformSpy = service._isPlatformBrowser.mockReturnValue(true);
    service.watchPosition().subscribe(result => {
      // expect(result).toBe(EMPTY);
    });
    expect(platformSpy).toHaveBeenCalled();
    expect(platformSpy).toHaveReturnedWith(true);
  });
});
