// tslint:disable:no-property-initializers
import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import distance from '@turf/distance';
import { point } from '@turf/helpers';
import _every from 'lodash-es/every';
import _has from 'lodash-es/has';
import _partial from 'lodash-es/partial';
import { asyncScheduler, merge, of, ReplaySubject, throwError, timer } from 'rxjs';
import {
  catchError,
  delay,
  distinctUntilChanged,
  filter,
  map,
  retry,
  retryWhen,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { CURRENT_GEOLOCATION_CONFIG, CurrentGeolocationConfig } from '../config';
import { log } from '../log';
import { GeoIpService, GpsLocationService } from '../services';
import * as LocalActions from './actions';

@Injectable()
export class CurrentGeolocationEffects {
  @Effect() startPositioning$ = this._actions$.pipe(
    ofType<LocalActions.StartPositioning>(LocalActions.CurrentGeolocationActionTypes.START_POSITIONING),
    switchMap(() =>
      merge(this.geoip$, this.geolocation$).pipe(map(result => new LocalActions.CurrentLocationObtained(result)))
    )
  );

  @Effect({ dispatch: false }) startBrowserPositioning$ = this._actions$.pipe(
    ofType<LocalActions.StartBrowserPositioning>(LocalActions.CurrentGeolocationActionTypes.START_BROWSER_POSITIONING),
    tap(() => this.browserPositioning$.next(true))
  );

  @Effect() init$ = of(new LocalActions.StartPositioning(), asyncScheduler);

  private readonly browserPositioning$ = new ReplaySubject<boolean>(1);

  private readonly geolocation$ = timer(0, this._config.interval).pipe(
    switchMap(() => this.browserPositioning$),
    filter(positioning => positioning),
    switchMap(() => {
      log.data('Getting current location...');

      return this._geolocationService.watchPosition().take(1);
    }),
    distinctUntilChanged((pos1: Position, pos2: Position) => {
      const point1 = point([pos1.coords.longitude, pos1.coords.latitude]);
      const point2 = point([pos2.coords.longitude, pos2.coords.latitude]);

      return distance(point1, point2) <= this._config.minDistance / 1000;
    }),
    map(pos => {
      log.data('Current location result: ', pos);

      return {
        coords: {
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          altitudeAccuracy: pos.coords.altitudeAccuracy,
          heading: pos.coords.heading,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          speed: pos.coords.speed
        },
        timestamp: pos.timestamp
      };
    }),
    catchError(err => {
      log.error('Current location error: ', err);

      return throwError(err);
    }),
    retry()
  );

  private readonly geoip$ = this._geoIpService.getLocation().pipe(
    take(1),
    // Emit the value once if geolocation$ not emits
    takeUntil(this.geolocation$),
    tap(body => log.data('GeoIP result: ', body)),
    // Filter out responses without the required params
    filter(body => _every(['latitude', 'longitude', 'accuracy'], _partial(_has, body))),
    map(body => ({
      coords: {
        accuracy: body.accuracy,
        altitude: undefined,
        altitudeAccuracy: undefined,
        heading: undefined,
        latitude: body.latitude,
        longitude: body.longitude,
        speed: undefined
      },
      timestamp: Date.now()
    })),
    catchError(ipErr => {
      log.error('Current ip error: ', ipErr);

      return throwError(ipErr);
    }),
    retryWhen(errors =>
      errors.pipe(
        delay(1000),
        take(3)
      )
    )
  );

  constructor(
    private readonly _geolocationService: GpsLocationService,
    private readonly _geoIpService: GeoIpService,
    private readonly _actions$: Actions,
    @Inject(CURRENT_GEOLOCATION_CONFIG) private readonly _config: CurrentGeolocationConfig
  ) {}
}
