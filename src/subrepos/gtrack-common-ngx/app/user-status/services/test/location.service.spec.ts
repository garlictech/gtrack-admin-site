import { LocationService } from '../location.service';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

describe('LocationService', () => {
  let service: LocationService;
  let destroy$: Subject<boolean>;

  let fakeCallback: (cb: PositionCallback, errorCb?: PositionErrorCallback, options?: PositionOptions) => void;
  let fakeErrorCallback: (cb: PositionCallback, errorCb: PositionErrorCallback) => void;

  beforeEach(() => {
    destroy$ = new Subject<boolean>();
    service = new LocationService();

    let error: PositionError = {
      message: 'Permission denied',
      code: 1,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    };

    fakeCallback = (cb) => {
      cb({
        timestamp: new Date().getTime(),
        coords: {
          longitude: 0,
          latitude: 0,
          altitude: 0,
          accuracy: 0,
          altitudeAccuracy: 0,
          heading: null,
          speed: 0
        }
      });
    };

    fakeErrorCallback = (cb, errorCb) => {
      errorCb(error);
    };
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.complete();
  });

  it("should request the user's location", done => {
    let spy = spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(fakeCallback);

    service
      .requestLocation()
      .takeUntil(destroy$)
      .subscribe(location => {
        expect(location).toEqual([0, 0]);
        expect(spy.calls.mostRecent().args[2]).toEqual(undefined);

        done();
      }, err => done.fail(err));
  });

  it('should pass the options parameter', done => {
    let spy = spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(fakeCallback);

    service
      .requestLocation({
        enableHighAccuracy: true
      })
      .takeUntil(destroy$)
      .subscribe(location => {
        expect(location).toEqual([0, 0]);
        expect(spy.calls.mostRecent().args[2]).toEqual({
          enableHighAccuracy: true
        });

        done();
      }, err => done.fail(err));
  });

  it('should handle the location errors', done => {
    let spy = spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake(fakeErrorCallback);

    service
      .requestLocation()
      .takeUntil(destroy$)
      .subscribe(() => {
        done.fail(new Error('Not failed'));
      }, (err: PositionError) => {
        expect(spy).toHaveBeenCalled();
        expect(err.code).toEqual(1);
        expect(err.message).toEqual('Permission denied');
        done();
      });
  });
});
