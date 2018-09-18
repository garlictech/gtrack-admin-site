<<<<<<< HEAD
import { timer as observableTimer, Subscription, Observable, merge, throwError } from 'rxjs';
=======
import { timer as observableTimer,  Subscription,  Observable, merge, throwError } from 'rxjs';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { log, DebugLog } from 'app/log';
import { State } from 'app/store';

<<<<<<< HEAD
import _every from 'lodash-es/every';
import _partial from 'lodash-es/partial';
import _has from 'lodash-es/has';

import { take, takeUntil, map, filter, mergeMap, retry, retryWhen, delay, tap, catchError } from 'rxjs/operators';
=======
import * as _ from 'lodash';

import {
  take,
  takeUntil,
  map,
  filter,
  mergeMap,
  retry,
  retryWhen,
  delay,
  tap,
  catchError
} from 'rxjs/operators';
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661

import * as Actions from './store/actions';
import { BACKGROUND_GEOLOCATION_CONFIG_TOKEN, IBackgroundGeolocationServiceConfig } from './config';
import { GeoIpService } from '../geoip';

@Injectable()
export class BackgroundGeolocationService {
  protected _subscription: Subscription | undefined;

  constructor(
    protected _store: Store<State>,
    @Inject(BACKGROUND_GEOLOCATION_CONFIG_TOKEN) protected _config: IBackgroundGeolocationServiceConfig,
    private _geoip: GeoIpService
  ) {
    /* EMPTY */
  }

  @DebugLog
  public start() {
    log.data('Determining current location starts in browser mode');
    this.end();

<<<<<<< HEAD
    const geolocation$ = observableTimer(0, 60000).pipe(
      mergeMap(() => {
        log.data('Getting current location...');
        return this._watchPosition();
      }),
      take(1),
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

    const geoip$ = this._geoip.getLocation().pipe(
      take(1),
      // Emit the value once if geolocation$ not emits
      takeUntil(geolocation$),
      tap(body => log.data('GeoIP result: ', body)),
      // Filter out responses without the required params
      filter(body => _every(['latitude', 'longitude', 'accuracy'], _partial(_has, body))),
      map(body => {
        return {
          coords: {
            accuracy: body.accuracy,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: body.latitude,
            longitude: body.longitude,
            speed: null
          },
          timestamp: new Date().getTime()
        };
      }),
      catchError(err => {
        log.error('Current location error: ', err);
        return throwError(err);
      }),
      retryWhen(errors =>
        errors.pipe(
          delay(1000),
          take(3)
=======
    const geolocation$ = observableTimer(0, 60000)
      .pipe(
        mergeMap(() => {
          log.data('Getting current location...');
          return this._watchPosition();
        }),
        take(1),
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

    const geoip$ = this._geoip.getLocation()
      .pipe(
        take(1),
        // Emit the value once if geolocation$ not emits
        takeUntil(geolocation$),
        tap(body => log.data('GeoIP result: ', body)),
        // Filter out responses without the required params
        filter(body => _.every(['latitude', 'longitude', 'accuracy'], _.partial(_.has, body))),
        map(body => {
          return {
            coords: {
              accuracy: body.accuracy,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              latitude: body.latitude,
              longitude: body.longitude,
              speed: null
            },
            timestamp: new Date().getTime()
          };
        }),
        catchError(err => {
          log.error('Current location error: ', err);
          return throwError(err);
        }),
        retryWhen(errors =>
          errors
            .pipe(
              delay(1000),
              take(3)
            )
>>>>>>> 812629b4063c7346ab03802170a17ea5c904c661
        )
      );

    this._subscription = merge(geoip$, geolocation$)
      .pipe(
        map(result => this._store.dispatch(new Actions.CurrentLocationObtained(result)))
      )
      .subscribe();

    return true;
  }

  @DebugLog
  public end() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = undefined;
    }
  }

  private _watchPosition(geolocationOptions?: PositionOptions) {
    return new Observable<Position>(observer => {
      const watchId = window.navigator.geolocation.watchPosition(
        pos => observer.next(pos),
        err => observer.error(err),
        geolocationOptions
      );

      return () => {
        window.navigator.geolocation.clearWatch(watchId);
      };
    });
  }
}
