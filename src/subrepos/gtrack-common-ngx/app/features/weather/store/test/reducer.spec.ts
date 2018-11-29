  import {
    weatherReducer,
    weatherContextReducerIntialState,
    weatherReducerInitialState
  } from '../reducer';

  import { IWeatherState } from '../state';
  import * as actions from '../actions';

  describe('Weather reducer', () => {
    let initialState: IWeatherState;
    const position = [19.040236, 47.497913];

    beforeEach(() => {
      initialState = {
        contexts: weatherContextReducerIntialState,
        weathers: weatherReducerInitialState
      };
    });

    describe('undefined action', () => {
      it('should return the default state', () => {
        const action = {} as any;
        const state = weatherReducer(undefined, action);

        expect(state).toEqual(initialState);
      });
    });

    describe('GET_FORECAST action', () => {
      it('should set loading to true', () => {
        const action = new actions.GetForecast(position);
        const state = weatherReducer(initialState, action);
        const id = `${position[0]}-${position[1]}`;

        expect(state.weathers.ids).toEqual([]);
        expect(state.contexts.ids).toEqual([id]);
        expect(state.contexts.entities[id].loaded).toEqual(false);
        expect(state.contexts.entities[id].loading).toEqual(true);
      });
    });

    describe('FORECAST_RETURNED action', () => {
      it('should add the forecast to the store', () => {
        const id = `${position[0]}-${position[1]}`;
        const action = new actions.ForecastReturned({id: id} as any);
        const state = weatherReducer(initialState, action);

        expect(state.weathers.ids).toEqual([id]);
        expect(state.contexts.ids).toEqual([id]);
        expect(state.contexts.entities[id].loaded).toEqual(true);
        expect(state.contexts.entities[id].loading).toEqual(false);
        expect(state.weathers.entities[id]).toEqual({
          id: id
        });
      });
    });

  });
