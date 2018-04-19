import { Action } from '@ngrx/store';
import { IHikeEditGeneralInfoState } from '../../state/hike-edit-general-info';
import {
  initialGeneralInfoState, descriptionInitialState, hikeEditGeneralInfoReducer
} from '../hike-edit-general-info';
import { hikeEditGeneralInfoActions } from '../..';
import { ITextualDescriptionItem } from '../../../shared/interfaces';

import * as _ from 'lodash';

describe('HikeEditGeneralInfo reducers', () => {
  let initialState: IHikeEditGeneralInfoState;

  beforeEach(() => {
    initialState = {
      generalInfo: initialGeneralInfoState,
      descriptions: descriptionInitialState
    };
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = hikeEditGeneralInfoReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('ResetGeneralInfoState action', () => {
    it('should reset state', () => {
      const action = new hikeEditGeneralInfoActions.ResetGeneralInfoState();
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('SetInitialized action', () => {
    it('should set initialized state', () => {
      const action = new hikeEditGeneralInfoActions.SetInitialized();
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.generalInfo.initialized).toEqual(true);
      // untouched props, good to add regardless
      expect(state.generalInfo.routeId).toEqual('');
      expect(state.generalInfo.isRoundTrip).toEqual(false);
      expect(state.generalInfo.difficulty).toEqual(5);
      expect(state.generalInfo.pois).toEqual([]);
      expect(state.descriptions.ids).toEqual([]);
    });
  });

  describe('SetHikeId action', () => {
    it('should set hike id', () => {
      const action = new hikeEditGeneralInfoActions.SetHikeId({ hikeId: 'fakeHikeId' });
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.generalInfo.hikeId).toEqual('fakeHikeId');
      // untouched props, good to add regardless
      expect(state.generalInfo.initialized).toEqual(false);
      expect(state.generalInfo.routeId).toEqual('');
      expect(state.generalInfo.isRoundTrip).toEqual(false);
      expect(state.generalInfo.difficulty).toEqual(5);
      expect(state.generalInfo.pois).toEqual([]);
      expect(state.descriptions.ids).toEqual([]);
    });
  });

  describe('SetRouteId action', () => {
    it('should set route id', () => {
      const action = new hikeEditGeneralInfoActions.SetRouteId({ routeId: 'fakeRouteId' });
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.generalInfo.routeId).toEqual('fakeRouteId');
      // untouched props, good to add regardless
      expect(state.generalInfo.initialized).toEqual(false);
      expect(state.generalInfo.hikeId).toEqual('');
      expect(state.generalInfo.isRoundTrip).toEqual(false);
      expect(state.generalInfo.difficulty).toEqual(5);
      expect(state.generalInfo.pois).toEqual([]);
      expect(state.descriptions.ids).toEqual([]);
    });
  });

  describe('SetGeneralInfo action', () => {
    it('should set generalInfo', () => {
      const action = new hikeEditGeneralInfoActions.SetDifficulty({
        difficulty: 1
      });
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.generalInfo.difficulty).toEqual(1);
      // untouched props, good to add regardless
      expect(state.generalInfo.initialized).toEqual(false);
      expect(state.generalInfo.hikeId).toEqual('');
      expect(state.generalInfo.routeId).toEqual('');
      expect(state.generalInfo.isRoundTrip).toEqual(false);
      expect(state.generalInfo.pois).toEqual([]);
      expect(state.descriptions.ids).toEqual([]);
    });
  });

  describe('SetGeneralInfo action', () => {
    it('should set generalInfo', () => {
      const action = new hikeEditGeneralInfoActions.SetIsRoundTrip({
        isRoundTrip: true
      });
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.generalInfo.isRoundTrip).toEqual(true);
      // untouched props, good to add regardless
      expect(state.generalInfo.initialized).toEqual(false);
      expect(state.generalInfo.hikeId).toEqual('');
      expect(state.generalInfo.routeId).toEqual('');
      expect(state.generalInfo.pois).toEqual([]);
      expect(state.generalInfo.difficulty).toEqual(5);
      expect(state.descriptions.ids).toEqual([]);
    });
  });

  describe('SetPoi action', () => {
    it('should set pois', () => {
      const action = new hikeEditGeneralInfoActions.SetPois({ pois: ['id1', 'id2'] });
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.generalInfo.pois).toEqual(['id1', 'id2']);
      // untouched props, good to add regardless
      expect(state.generalInfo.initialized).toEqual(false);
      expect(state.generalInfo.hikeId).toEqual('');
      expect(state.generalInfo.routeId).toEqual('');
      expect(state.generalInfo.isRoundTrip).toEqual(false);
      expect(state.generalInfo.difficulty).toEqual(5);
      expect(state.descriptions.ids).toEqual([]);
    });
  });

  describe('AddPoi action', () => {
    it('should add pois', () => {
      const action = new hikeEditGeneralInfoActions.AddPoi({ poi: 'id1' });
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.generalInfo.pois).toEqual(['id1']);
      // untouched props, good to add regardless
      expect(state.generalInfo.initialized).toEqual(false);
      expect(state.generalInfo.hikeId).toEqual('');
      expect(state.generalInfo.routeId).toEqual('');
      expect(state.generalInfo.isRoundTrip).toEqual(false);
      expect(state.generalInfo.difficulty).toEqual(5);
      expect(state.descriptions.ids).toEqual([]);
    });
  });

  describe('RemovePoi action', () => {
    it('should remove pois', () => {
      const action = new hikeEditGeneralInfoActions.RemovePoi({ poi: 'id2' });
      const state = hikeEditGeneralInfoReducer(_.merge({}, initialState, {
        generalInfo: {
          pois: ['id1', 'id2']
        }
      }), action);

      expect(state.generalInfo.pois).toEqual(['id1']);
      // untouched props, good to add regardless
      expect(state.generalInfo.initialized).toEqual(false);
      expect(state.generalInfo.hikeId).toEqual('');
      expect(state.generalInfo.routeId).toEqual('');
      expect(state.generalInfo.isRoundTrip).toEqual(false);
      expect(state.generalInfo.difficulty).toEqual(5);
      expect(state.descriptions.ids).toEqual([]);
    });
  });

  describe('SetDescriptions action', () => {
    it('should set descriptions', () => {
      const descriptions: ITextualDescriptionItem[] = [
        { id: 'hu_HU', title: 'Title #1', summary: 'Summary #1', fullDescription: 'Description #1' },
        { id: 'en_US', title: 'Title #2', summary: 'Summary #2', fullDescription: 'Description #2' }
      ];
      const entities = {
        'hu_HU': descriptions[0],
        'en_US': descriptions[1]
      };
      const action = new hikeEditGeneralInfoActions.SetDescriptions({ descriptions: descriptions });
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.descriptions.entities).toEqual(entities);
    });
  });

  describe('AddDescription action', () => {
    it('should add description', () => {
      const description: ITextualDescriptionItem = {
        id: 'hu_HU', title: 'Title #1', summary: 'Summary #1', fullDescription: 'Description #1'
      };
      const entities = {
        'hu_HU': description
      };
      const action = new hikeEditGeneralInfoActions.AddDescription({ description: description });
      const state = hikeEditGeneralInfoReducer(initialState, action);

      expect(state.descriptions.entities).toEqual(entities);
    });
  });
});
