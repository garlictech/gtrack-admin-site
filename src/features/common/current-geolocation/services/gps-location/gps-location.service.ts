import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';

@Injectable()
export class GpsLocationService {
  constructor(@Inject(PLATFORM_ID) private readonly _platformId: object) {}

  watchPosition(geolocationOptions?: PositionOptions): Observable<Position> {
    if (this._isPlatformBrowser(this._platformId)) {
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

    return EMPTY;
  }

  protected _isPlatformBrowser(platformId: object): boolean {
    return isPlatformBrowser(platformId);
  }
}
