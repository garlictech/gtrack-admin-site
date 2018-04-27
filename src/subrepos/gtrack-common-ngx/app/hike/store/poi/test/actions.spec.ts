import { IPoi, IPoiStored, EPoiTypes } from 'subrepos/provider-client';
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
      timestamp: new Date().getTime()
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
})
