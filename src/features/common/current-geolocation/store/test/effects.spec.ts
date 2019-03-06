import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot, Scheduler } from 'jest-marbles';
import { Observable, of } from 'rxjs';

import { CurrentGeolocationEffects as Effects } from '../effects';
import * as fromActions from '../actions';
import { GpsLocationService, GeoIpService } from '../../services';
import { CURRENT_GEOLOCATION_CONFIG } from '../../config';

describe('CurrentGeolocation effect tests', () => {
  let actions: Observable<any>;
  let effects: Effects;
  let gpsLocationServiceMock: any;
  let geoIpServiceMock: any;
  let currentGeolocationConfigMock: any;

  const mockGeolocation = {
    coords: {
      accuracy: 20,
      altitude: undefined,
      altitudeAccuracy: undefined,
      heading: undefined,
      latitude: 47.5,
      longitude: 19.0833,
      speed: undefined
    },
    timestamp: 1542882902211
  };

  const dateMock = jest.spyOn(Date, 'now').mockReturnValue(1542882902211);

  beforeEach(() => {
    gpsLocationServiceMock = {
      watchPosition: jest.fn()
    };
    geoIpServiceMock = {
      getLocation: jest.fn().mockImplementation(() =>
        of({
          accuracy: 20,
          latitude: 47.5,
          longitude: 19.0833
        })
      )
    };
    currentGeolocationConfigMock = {
      debug: false,
      interval: 60000
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: GpsLocationService, useValue: gpsLocationServiceMock },
        { provide: GeoIpService, useValue: geoIpServiceMock },
        { provide: CURRENT_GEOLOCATION_CONFIG, useValue: currentGeolocationConfigMock },
        Effects,
        provideMockActions(() => actions)
      ]
    });

    effects = TestBed.get(Effects);
  });

  describe('startPositioning effect', () => {
    it('should start locating', () => {
      const action = new fromActions.StartPositioning();
      const geoLocationOutcome = new fromActions.CurrentLocationObtained(mockGeolocation);
      const expected = cold('--b-', { b: geoLocationOutcome });
      actions = hot('--a-', { a: action });
      expect(effects.startPositioning$).toBeObservable(expected);
      Scheduler.get().flush();
      expect(dateMock).toHaveBeenCalled();
      expect(geoIpServiceMock.getLocation).toHaveBeenCalled();
      // expect(gpsLocationServiceMock.watchPosition).toHaveBeenCalled();
    });
  });
});
