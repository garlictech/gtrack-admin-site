import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { IOpenWeatherMapForecast } from '../interfaces';

@Injectable()
export class WeatherService {
  private _apiUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private _http: HttpClient) {}

  public getWeather(position: GeoJSON.Position) {
    return this._http.get<IOpenWeatherMapForecast>(`${this._apiUrl}/forecast`, {
      params: {
        lat: position[1].toString(),
        lon: position[0].toString(),
        APIKEY: environment.openWeatherMap.key,
        units: 'metric'
      }
    });
  }
}
