import * as actions from '../actions';

describe('Weather actions', () => {

  describe('GetForecast', () => {
    it('should create an action', () => {
      const position = [19.040236, 47.497913];
      const action = new actions.GetForecast(position);

      expect(action.type).toEqual(actions.WeatherActionTypes.GET_FORECAST);
    });
  });

  describe('ForecastReturned', () => {
    it('should create an action', () => {
      const forecast = {
        test: true
      };

      const action = new actions.ForecastReturned(forecast as any);
      expect(action.type).toEqual(actions.WeatherActionTypes.FORECAST_RETURNED);
      expect(action.forecast).toEqual(forecast);
    });
  });

});
