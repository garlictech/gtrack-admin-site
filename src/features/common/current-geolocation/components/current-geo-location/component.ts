import { Observable, of } from 'rxjs';
import { catchError, delay, filter, map, retryWhen } from 'rxjs/operators';

import { Component, Inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { GEO_TIMEOUT_CONFIG, GeoTimeOutConfig } from '../../config';
import { GeoCoordinates } from '../../interfaces';
import { selectCurrentLocation } from '../../store';

@Component({
  selector: 'app-current-geolocation',
  template: ''
})
export class CurrentGeoLocationComponent implements OnInit {
  currentLocation$: Observable<GeoCoordinates>;
  errorMessage: string;
  constructor(
    private readonly _store: Store<any>,
    @Inject(GEO_TIMEOUT_CONFIG) private readonly config: GeoTimeOutConfig
  ) {}

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  getCurrentLocation(): Observable<GeoCoordinates | null> {
    return (this.currentLocation$ = this._store.pipe(
      select(selectCurrentLocation),
      filter(location => !!location),
      map(location => location.coords),
      retryWhen(errors => errors.pipe(delay(this.config.timeOut))),
      catchError(err => {
        this.errorMessage = 'Cannot obtain coordinates...';

        return of(err);
      })
    ));
  }
}
