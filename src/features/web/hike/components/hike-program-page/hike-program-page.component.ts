import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import _get from 'lodash-es/get';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { getHikeSpeed, getHikeStartDate } from '@bit/garlictech.angular-features.common.settings/store/selectors';
import { WeatherEntity, WeatherSelectors } from '@bit/garlictech.angular-features.common.weather/store';
import * as actions from '@bit/garlictech.angular-features.common.weather/store/actions';

import { HikeProgram } from '@bit/garlictech.angular-features.common.hike';
import { Poi } from '@bit/garlictech.angular-features.common.poi';
import { Route } from '@bit/garlictech.angular-features.common.route';

@Component({
  selector: 'gtrack-hike-program-page',
  templateUrl: './hike-program-page.component.html',
  styleUrls: ['./hike-program-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HikeProgramPageComponent implements OnInit {
  get images(): Array<string> {
    let urls: Array<string> = [];

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;

      urls = imageUrls.map(image => _get(image, 'original.url', ''));
    }

    return urls;
  }
  @Input() hikeProgram: HikeProgram;
  @Input() route: Route;
  @Input() pois: Array<Poi>;

  forecast$: Observable<WeatherEntity>;

  startDate$: Observable<Date>;
  speed$: Observable<number>;

  private _position: GeoJSON.Position;

  constructor(private readonly _store: Store<any>, private readonly _weatherSelectors: WeatherSelectors) {}

  ngOnInit(): void {
    const start = this.hikeProgram.stops[0];

    this.startDate$ = this._store.pipe(select(getHikeStartDate));

    this.speed$ = this._store.pipe(select(getHikeSpeed));

    if (start) {
      this._position = [start.lon, start.lat];
      this.forecast$ = this._store.pipe(
        select(this._weatherSelectors.getWeatherContext(this._position)),
        tap(context => {
          if (!context || (!context.loading && !context.loaded)) {
            this._store.dispatch(new actions.GetForecast(this._position));
          }
        }),
        map(context => context && context.loaded),
        filter(loaded => loaded),
        switchMap(() => this._store.pipe(select(this._weatherSelectors.getWeather(this._position))))
      );
    }
  }
}
