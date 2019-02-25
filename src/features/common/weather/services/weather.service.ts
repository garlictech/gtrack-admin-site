import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { OpenWeatherMapForecast } from '../interfaces';

@Injectable()
export class WeatherService {
  private readonly _apiUrl: string;

  constructor(private readonly _http: HttpClient) {
    this._apiUrl = 'https://api.openweathermap.org/data/2.5';
  }

  getWeather(position: GeoJSON.Position): Observable<any> {
    return this._http.get<OpenWeatherMapForecast>(`${this._apiUrl}/forecast`, {
      params: {
        lat: position[1].toString(),
        lon: position[0].toString(),
        APIKEY: environment.openWeatherMap.key,
        units: 'metric'
      }
    });
  }
}
