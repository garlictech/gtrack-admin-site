import { Action } from '@ngrx/store';
import {
  initialMapState, hikeEditMapReducer
} from '../hike-edit-map';
import { IHikeEditMapState } from '../../state/hike-edit-map';
import { hikeEditMapActions, adminMapActions } from '../..';

import * as _ from 'lodash';

describe('HikeEditMap reducers', () => {
  let initialState: IHikeEditMapState;
  let markers: any[];
  let entities: any;

  beforeEach(() => {
    initialState = _.cloneDeep(initialMapState);

    markers = [
      { id: '1', lat: 0, lon: 0, title: 'Marker #1' },
      { id: '2', lat: 0, lon: 0, title: 'Marker #2' }
    ];

    entities = {
      '1': markers[0],
      '2': markers[1]
    };
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = hikeEditMapReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('RegisterMap action', () => {
    it('should register map', () => {
      const action = new adminMapActions.RegisterMap({ mapId: 'fakeId' });
      const state = hikeEditMapReducer(initialState, action);

      expect(state.mapId).toEqual('fakeId');
    });
  });

  describe('ResetMap action', () => {
    it('should reset map', () => {
      const action = new adminMapActions.ResetMap();
      const state = hikeEditMapReducer(initialState, action);

      expect(state.mapId).toEqual('');
    });
  });
});
