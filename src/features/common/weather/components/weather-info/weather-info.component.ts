import { select, Store } from '@ngrx/store';
import _groupBy from 'lodash-es/groupBy';
import _isEmpty from 'lodash-es/isEmpty';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OpenWeatherMapForecastItem } from '../../interfaces';
import * as actions from '../../store/actions';
import { WeatherSelectors } from '../../store/selectors';
import { WeatherEntity } from '../../store/state';

import { DebugLog, log } from '../../log';

const getDailyForecast = (forecast: WeatherEntity, date: Date): any => {
  const dayStart = new Date(date.getTime());
  const ONEDAY = 86400 * 1000; // ms in one day

  dayStart.setHours(0);
  dayStart.setMinutes(0);
  dayStart.setSeconds(0);
  dayStart.setMilliseconds(0);

  const dayEnd = new Date(dayStart.getTime() + ONEDAY);
  const start = dayStart.getTime();
  const end = dayEnd.getTime();

  const items = forecast.list.filter(item => {
    const dtTime = item.dt * 1000; // Convert to ms

    return start <= dtTime && dtTime < end;
  });

  if (items.length === 0) {
    return undefined;
  }

  const mins = items.map(item => item.main.temp_min);
  const maxes = items.map(item => item.main.temp_max);
  const sum = items.reduce((prev, current) => prev + current.main.temp, 0);
  const avg = Math.round(sum / items.length);

  const min = Math.min(...mins);
  const max = Math.max(...maxes);

  return {
    avg,
    min,
    max
  };
};

@Component({
  selector: 'gtrack-common-weather-info',
  template: ''
})
export class WeatherInfoComponent implements OnInit, OnChanges {
  @Input() position: GeoJSON.Position;

  @Input() date;

  date$: ReplaySubject<Date>;

  forecast$: Observable<Array<Array<OpenWeatherMapForecastItem>> | undefined>;

  dailyForecast$: Observable<any>;

  constructor(protected _selectors: WeatherSelectors, protected _store: Store<any>) {
    this.date$ = new ReplaySubject<Date>(1);
  }

  ngOnInit(): void {
    if (this.date) {
      this.date$.next(this.date);
    }

    const forecast$ = combineLatest(
      this._store.pipe(
        select(this._selectors.getWeatherContext(this.position)),
        tap(context => {
          log.data('Context', context);
          if (!context || (!context.loading && !context.loaded)) {
            this._store.dispatch(new actions.GetForecast(this.position));
          }
        }),
        map(context => context && context.loaded),
        filter(loaded => loaded),
        switchMap(() => this._store.pipe(select(this._selectors.getWeather(this.position))))
      ),
      this.date$
    );

    this.forecast$ = forecast$.pipe(
      tap(results => log.data('Forecast data:', results)),
      map(([forecast, date]) => this._getForecastForDate(forecast, date)),
      map(forecast =>
        Object.values(
          _groupBy(forecast, item => {
            const date = new Date(item.dt * 1000);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);

            return date.getTime();
          })
        )
      ),
      map(results => (results.length === 0 ? undefined : results))
    );

    this.dailyForecast$ = forecast$.pipe(map(([forecast, date]) => getDailyForecast(forecast, date)));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.date) {
      const date = changes.date.currentValue;
      this.date$.next(date);
    }
  }

  @DebugLog _getForecastForDate(forecast: WeatherEntity, date: Date): Array<OpenWeatherMapForecastItem> {
    const dateAsTime = date.getTime();

    return forecast.list.filter(item => {
      const dtTime = item.dt * 1000; // Convert to ms
      const prevTime = dateAsTime - 3 * 60 * 60 * 1000; // 3 hours

      return prevTime < dtTime;
    });
  }
}
