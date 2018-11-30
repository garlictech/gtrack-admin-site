import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, StoreModule, ActionReducerMap } from '@ngrx/store';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
  IWeatherState,
  weatherReducer,
  weatherReducerInitialState,
  weatherContextReducerIntialState,
  WeatherSelectors
} from '@common.features/weather/store';
import * as actions from '@common.features/weather/store/actions';
import {
  WeatherIconComponent,
  WindDirectionIconComponent
} from '@common.features/weather/components';
import { WeatherInfoComponent } from '../weather-info.component';

import { weather as testWeather } from './fixture';

describe('WeatherInfoComponent', () => {
  let component: WeatherInfoComponent;
  let fixture: ComponentFixture<WeatherInfoComponent>;
  let date: Date;
  const position: GeoJSON.Position = [19.040236, 47.497913];
  const id = `${position[0]}-${position[1]}`;
  let initialState: IWeatherState;

  let store: Store<{
    'features.weather': IWeatherState;
  }>;

  beforeEach(async(() => {
    initialState = {
      contexts: weatherContextReducerIntialState,
      weathers: weatherReducerInitialState
    };

    TestBed.configureTestingModule({
      imports: [
        AngularSvgIconModule,
        HttpClientTestingModule,
        StoreModule.forRoot(
          {
            'features.weather': weatherReducer
          },
          {
            initialState: {
              'features.weather': initialState
            }
          }
        )
      ],
      declarations: [WeatherIconComponent, WindDirectionIconComponent, WeatherInfoComponent],
      providers: [WeatherSelectors]
    });
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();

    date = new Date('2018-01-01 12:00:00');

    fixture = TestBed.createComponent(WeatherInfoComponent);
    component = fixture.componentInstance;
    component.date = date;
    component.position = position;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('When not loaded', () => {
    it('should be call the load action', () => {
      expect(store.dispatch).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: actions.WeatherActionTypes.GET_FORECAST,
          position: position
        })
      );
    });

    it('should display an error message', () => {
      const el = fixture.nativeElement;

      expect(el.textContent).toMatch(
        /No forecast data is available for the selected hike start date./
      );
    });
  });

  describe('When loaded', () => {
    beforeEach(() => {
      store.dispatch(
        new actions.ForecastReturned({
          id: id,
          ...testWeather
        })
      );

      fixture.detectChanges();
    });

    it('should be display the data if loaded', () => {
      const container = fixture.nativeElement.querySelector('.forecast-item');
      const spans = container.querySelectorAll('span');

      // Fix the timezone differences
      const offset = new Date().getTimezoneOffset();
      const expected = 10 - offset / 60;
      let expectedString = expected.toString();

      if (expected < 10) {
        expectedString = `0${expected}`;
      }

      expect(spans[0].textContent).toEqual(`${expectedString}:00`);
      expect(spans[1].textContent).toEqual('6 °C');
    });
  });
});
