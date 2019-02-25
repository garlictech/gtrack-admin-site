export interface OpenWeatherMapForecastItem {
  clouds: object;
  dt: number;
  dt_txt: string;
  main: {
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_kf: number;
    temp_max: number;
    temp_min: number;
  };
  rain: object;
  sys: object;
  weather: Array<{
    description: string;
    icon: string;
    id: number;
    main: string;
  }>;
  wind: {
    deg: number;
    speed: number;
  };
}

export interface OpenWeatherMapForecast {
  city: {
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    id: number;
    name: string;
    population?: number;
  };
  cnt: number;
  cod: string;
  list: Array<OpenWeatherMapForecastItem>;
  message: number;
}
