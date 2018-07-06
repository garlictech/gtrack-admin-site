import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';

import * as Actions from './store/actions';
import { BACKGROUND_GEOLOCATION_CONFIG_TOKEN, IBackgroundGeolocationServiceConfig } from './config';
import { Observable } from 'rxjs/Observable';
import { log, DebugLog } from 'app/log';
import { State } from 'app/store';

@Injectable()
export class BackgroundGeolocationService {
  protected _subscription: Subscription | undefined;

  constructor(
    protected _store: Store<State>,
    @Inject(BACKGROUND_GEOLOCATION_CONFIG_TOKEN) protected _config: IBackgroundGeolocationServiceConfig
  ) {
    /* EMPTY */
  }

  @DebugLog
  public start() {
    log.d('Determining current location starts in browser mode');
    this.end();

    this._subscription = Observable.timer(0, 60000)
      .map(() => {
        log.d('Getting current location...');
        navigator.geolocation.getCurrentPosition(
          pos => {
            log.d('Current location result: ', pos);
            if (pos) {
              this._store.dispatch(new Actions.CurrentLocationObtained({
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
              }));
            }
          },
          err => log.er('Current location error: ', err)
        );
      })
      .retry()
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
}
