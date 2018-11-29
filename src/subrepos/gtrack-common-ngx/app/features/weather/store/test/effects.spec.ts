import { TestBed } from '@angular/core/testing';
import { EMPTY, of, Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot, Scheduler } from 'jest-marbles';

import { WeatherEffects } from '../effects';
import { WeatherService } from '../../services';

import * as actions from '../actions';

describe('Weather effects', () => {
  let service: WeatherService;
  let actions$: Observable<any>;
  let effects: WeatherEffects;

  const position = [19.040236, 47.497913];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherEffects,
        {
          provide: WeatherService,
          useValue: {
            getWeather: jasmine.createSpy('getWeather').and.returnValue(of({
              test: true
            }))
          }
        },
        provideMockActions(() => actions$)
      ]
    });

    service = TestBed.get(WeatherService);
    effects = TestBed.get(WeatherEffects);
  });

  describe('getForecast$', () => {
    it('should return ForecastReturned action', () => {
      const action = new actions.GetForecast(position);
      const completion = new actions.ForecastReturned({
        test: true,
        id: `${position[0]}-${position[1]}`
      } as any);

      const expected = cold('-b', { b: completion });

      actions$ = hot('-a', { a: action });

      expect(effects.getForecast$).toBeObservable(expected);

      Scheduler.get().flush();

      expect(service.getWeather).toHaveBeenCalledWith(position);
    });
  });
});
