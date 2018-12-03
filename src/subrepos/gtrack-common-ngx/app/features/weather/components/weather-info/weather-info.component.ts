import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { tap, filter, map, switchMap } from 'rxjs/operators';
import _groupBy from 'lodash-es/groupBy';
import _isEmpty from 'lodash-es/isEmpty';

import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as actions from '../../store/actions';
import { WeatherSelectors } from '../../store/selectors';
import { IWeatherEntity } from '../../store/state';
import { IOpenWeatherMapForecastItem } from '../../interfaces';

import { DebugLog, log } from 'app/log';

@Component({
  selector: 'gtrack-common-weather-info',
  template: ''
})
export class WeatherInfoComponent implements OnInit, OnChanges {
  @Input()
  public position: GeoJSON.Position;

  @Input()
  public date;

  public date$ = new ReplaySubject<Date>(1);

  public forecast$: Observable<IOpenWeatherMapForecastItem[][] | undefined>;

  public dailyForecast$: Observable<any>;

  constructor(protected _selectors: WeatherSelectors, protected _store: Store<any>) {}

  ngOnInit() {
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
        map(context => context && context.loaded === true),
        filter(loaded => loaded === true),
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

    this.dailyForecast$ = forecast$.pipe(map(([forecast, date]) => this._getDailyForecast(forecast, date)));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.date) {
      const date = changes.date.currentValue;
      this.date$.next(date);
    }
  }

  @DebugLog
  private _getForecastForDate(forecast: IWeatherEntity, date: Date) {
    const dateAsTime = date.getTime();

    return forecast.list.filter(item => {
      const dtTime = item.dt * 1000; // Convert to ms
      const prevTime = dateAsTime - 3 * 60 * 60 * 1000; // 3 hours

      return prevTime < dtTime;
    });
  }

  private _getDailyForecast(forecast: IWeatherEntity, date: Date) {
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
  }
}
