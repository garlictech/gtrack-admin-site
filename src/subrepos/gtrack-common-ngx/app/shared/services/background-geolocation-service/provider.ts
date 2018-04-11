import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as Actions from './store/actions';
import { Config } from './config';
import { Observable } from 'rxjs/Observable';
import { log, DebugLog } from 'app/log';
import { State } from 'app/store';

@Injectable()
export class BackgroundGeolocationService {
  constructor(private _store: Store<State>, private _config: Config) {
    /* EMPTY */
  }

  @DebugLog
  public init() {
    log.d('Determining current location starts in browser mode');
    Observable.timer(0, 60000)
      .map(() => {
        log.d('Getting current location...');
        navigator.geolocation.getCurrentPosition(
          pos => {
            log.d('Current location result: ', pos);
            if (pos) {
              this._store.dispatch(new Actions.CurrentLocationObtained(pos));
            }
          },
          err => log.er('Current location error: ', err)
        );
      })
      .subscribe();

    return true;
  }
}
