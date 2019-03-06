import { take } from 'rxjs/operators';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { defaultWeatherConfig, WEATHER_CONFIG } from '../../interfaces';
import { WeatherService } from '../weather.service';

const weatherConfig = { ...defaultWeatherConfig };
weatherConfig.openWeatherMap.key = 'testKey';

describe('WeatherService', () => {
  const position: GeoJSON.Position = [19.040236, 47.497913]; // lon, lat
  const apiUrl = 'https://api.openweathermap.org/data/2.5';
  let service: WeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherService,
        {
          provide: WEATHER_CONFIG,
          useValue: weatherConfig
        }
      ]
    });

    service = TestBed.get(WeatherService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('getWeather()', () => {
    it('should call openweathermap.org for weather forecast', () => {
      service
        .getWeather(position)
        .pipe(take(1))
        .subscribe(result => {
          expect(result as any).toEqual('success');
        });

      const url = `${apiUrl}/forecast`;
      const urlRegexp = new RegExp(`^${url}$`);
      const req = httpTestingController.expectOne(request => request.url.match(urlRegexp) !== null);

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('APIKEY')).toEqual(weatherConfig.openWeatherMap.key);
      expect(req.request.params.get('lat')).toEqual(position[1].toString());
      expect(req.request.params.get('lon')).toEqual(position[0].toString());

      req.flush('success');
    });
  });
});
