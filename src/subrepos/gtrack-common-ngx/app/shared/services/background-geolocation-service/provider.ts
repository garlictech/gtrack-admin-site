import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs';
import { log, DebugLog } from 'app/log';
import { State } from 'app/store';

import { merge, throwError } from 'rxjs';

import * as _ from 'lodash';

import {
  take,
  takeUntil,
  map,
  filter,
  switchMap,
  mergeMap,
  retry,
  retryWhen,
  delay,
  tap,
  catchError
} from 'rxjs/operators';

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

    const geolocation$ = Observable.timer(0, 60000).pipe(
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
      map(result => result.json()),
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
        errors.pipe(
          delay(1000),
          take(3)
        )
      )
    );

    this._subscription = merge(geoip$, geolocation$)
      .pipe(map(result => this._store.dispatch(new Actions.CurrentLocationObtained(result))))
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
