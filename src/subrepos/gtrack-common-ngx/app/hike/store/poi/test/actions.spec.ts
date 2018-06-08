import { IPoi, IPoiStored, EPoiTypes, EObjectState } from 'subrepos/provider-client';
import { pois as poiFixtures } from './fixtures';

import * as uuid from 'uuid/v4';
import * as actions from '../actions';

describe('Poi actions', () => {
  let id;
  let poiDataStored: IPoiStored;
  let poiData: IPoi;
  let poi: IPoiStored;

  beforeEach(() => {
    id = uuid();

    poiData = {
      id: id,
      lat: 42.25,
      lon: 19.32,
      elevation: 240,
      objectType: EPoiTypes.google,
      types: [],
      description: {
        en_US: {
          title: 'Test poi'
        }
      }
    };

    poi = {
      ...poiData,
      id: id,
      timestamp: new Date().getTime(),
      state: EObjectState.draft
    };
  });

  describe('LoadPoi action', () => {
    it('should create an action', () => {
      let action = new actions.LoadPoi(id);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.LOAD_POI,
        context: id
      });
    });
  });

  describe('PoiLoaded action', () => {
    it('should create an action', () => {
      let action = new actions.PoiLoaded(id, poi);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.POI_LOADED,
        context: id,
        poi: poi
      });
    });
  });

  describe('LoadPois action', () => {
    it('should create an action', () => {
      let action = new actions.LoadPois([id]);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.LOAD_POIS,
        contexts: [id]
      });
    });
  });

  describe('AllPoiLoaded action', () => {
    it('should create an action', () => {
      let action = new actions.AllPoiLoaded([id], [poi]);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.ALL_POI_LOADED,
        contexts: [id],
        pois: [poi]
      });
    });
  });

  describe('SavePoi action', () => {
    it('should create an action', () => {
      let action = new actions.SavePoi(poiData);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.SAVE_POI,
        poi: poiData
      });
    });
  });

  describe('PoiSaved action', () => {
    it('should create an action', () => {
      let action = new actions.PoiSaved(id);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.POI_SAVED,
        context: id
      });
    });
  });

  describe('PoiModified action', () => {
    it('should create an action', () => {
      let action = new actions.PoiModified(id);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.POI_MODIFIED,
        context: id
      });
    });
  });

  describe('UpdatePoiState action', () => {
    it('should create an action', () => {
      let action = new actions.UpdatePoiState(id, EObjectState.published);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.UPDATE_POI_STATE,
        id: id,
        state: EObjectState.published
      });
    });
  });

  describe('DeletePoi action', () => {
    it('should create an action', () => {
      let action = new actions.DeletePoi(id);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.DELETE_POI,
        id: id
      });
    });
  });

  describe('PoiDeleted action', () => {
    it('should create an action', () => {
      let action = new actions.PoiDeleted(id);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.POI_DELETED,
        context: id
      });
    });
  });

  describe('MergePoi action', () => {
    it('should create an action', () => {
      let action = new actions.MergePoi([poiFixtures[0].id, poiFixtures[1].id], poiFixtures[0]);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.MERGE_POI,
        ids: [poiFixtures[0].id, poiFixtures[1].id],
        newData: poiFixtures[0]
      });
    });
  });

  describe('PoiMergedSuccessfully action', () => {
    it('should create an action', () => {
      let newId = uuid();
      let action = new actions.PoiMergedSuccessfully(newId, [poiFixtures[0].id, poiFixtures[1].id]);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.POI_MERGED_SUCCESSFULLY,
        newId: newId,
        mergedIds: [poiFixtures[0].id, poiFixtures[1].id]
      });
    });
  });

  describe('PoiMergeFailed action', () => {
    it('should create an action', () => {
      let error = 'error';
      let action = new actions.PoiMergeFailed(error);

      expect({ ...action }).toEqual({
        type: actions.PoiActionTypes.POI_MERGE_FAILED,
        error: error
      });
    });
  });
});
