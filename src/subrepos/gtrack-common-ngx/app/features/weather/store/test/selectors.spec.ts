import { TestBed } from '@angular/core/testing';
import { Store, StoreModule, select } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { weatherReducer } from '../reducer';
import { featureName } from '../state';
import { WeatherSelectors } from '../selectors';
import * as actions from '../actions';

describe('Weather selectors', () => {
  const position = [19.040236, 47.497913];
  let store: Store<any>;
  let selectors: WeatherSelectors;
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    const reducers = {};
    reducers[featureName] = weatherReducer;

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers)
      ],
      providers: [
        WeatherSelectors
      ]
    });

    store = TestBed.get(Store);
    selectors = TestBed.get(WeatherSelectors);
    destroy$ = new Subject<boolean>();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.complete();
  });

  describe('getWeather', () => {
    it('should return the weather', () => {
      let result;

      store
        .pipe(
          select(selectors.getWeather(position)),
          takeUntil(destroy$)
        )
        .subscribe(weather => result = weather);

      expect(result).toEqual(undefined);

      store.dispatch(new actions.ForecastReturned({
        id: `${position[0]}-${position[1]}`,
        test: true
      } as any));

      expect(result).toEqual({
        id: `${position[0]}-${position[1]}`,
        test: true
      });
    });
  });

  describe('getWeatherContext', () => {
    it('should return the context', () => {
      let result;

      store
        .pipe(
          select(selectors.getWeatherContext(position)),
          takeUntil(destroy$)
        )
        .subscribe(context => result = context);

      expect(result).toEqual(undefined);

      store.dispatch(new actions.GetForecast(position));

      expect(result).toEqual({
        id: `${position[0]}-${position[1]}`,
        loading: true,
        loaded: false
      });

      store.dispatch(new actions.ForecastReturned({
        id: `${position[0]}-${position[1]}`,
        test: true
      } as any));

      expect(result).toEqual({
        id: `${position[0]}-${position[1]}`,
        loading: false,
        loaded: true
      });
    });
  });
});
