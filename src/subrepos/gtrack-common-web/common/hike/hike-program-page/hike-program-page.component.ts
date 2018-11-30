import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, map, filter, switchMap, combineLatest } from 'rxjs/operators';
import _get from 'lodash-es/get';

import { State } from 'app/store';
import { HikeProgram } from 'subrepos/gtrack-common-ngx';
import { getHikeStartDate, getHikeSpeed } from '@common.features/settings/store/selectors';
import { WeatherSelectors } from '@common.features/weather/store/selectors';
import { IWeatherEntity } from '@common.features/weather/store';
import * as actions from '@common.features/weather/store/actions';
import { log } from 'app/log';

@Component({
  selector: 'gtrack-hike-program-page',
  templateUrl: './hike-program-page.component.html',
  styleUrls: ['./hike-program-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HikeProgramPageComponent implements OnInit {
  @Input()
  public hikeProgram: HikeProgram;

  public forecast$: Observable<IWeatherEntity>;

  private _position: GeoJSON.Position;

  public startDate$: Observable<Date>;
  public speed$: Observable<number>;

  public get images() {
    let urls: string[] = [];

    if (this.hikeProgram && this.hikeProgram.backgroundImages instanceof Array) {
      const imageUrls = this.hikeProgram.backgroundImages;

      urls = imageUrls.map(image => _get(image, 'original.url', ''));
    }

    return urls;
  }

  constructor(private _store: Store<State>, private _weatherSelectors: WeatherSelectors) {}

  ngOnInit() {
    const start = this.hikeProgram.stops[0];

    this.startDate$ = this._store.pipe(select(getHikeStartDate));

    this.speed$ = this._store.pipe(select(getHikeSpeed));

    if (start) {
      this._position = [start.lon, start.lat];
      this.forecast$ = this._store.pipe(
        select(this._weatherSelectors.getWeatherContext(this._position)),
        tap(context => {
          log.data('Context', context);
          if (!context || (!context.loading && !context.loaded)) {
            this._store.dispatch(new actions.GetForecast(this._position));
          }
        }),
        map(context => context && context.loaded === true),
        filter(loaded => loaded === true),
        switchMap(() => this._store.pipe(select(this._weatherSelectors.getWeather(this._position))))
      );
    }
  }
}
