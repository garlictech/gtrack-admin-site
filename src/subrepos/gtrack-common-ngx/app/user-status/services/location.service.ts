import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/bindCallback';

@Injectable()
export class LocationService {

  constructor() { /**/ }

  public requestLocation(options?: PositionOptions): Observable<GeoJSON.Position> {
    let bound = Observable.bindCallback<GeoJSON.Position>((opt, cb) => {
      navigator.geolocation.getCurrentPosition((position) => {
        let coords = position.coords;

        cb([coords.longitude, coords.latitude]);
      }, err => {
        throw err;
      }, opt);
    });

    return bound(options);
  }
}
