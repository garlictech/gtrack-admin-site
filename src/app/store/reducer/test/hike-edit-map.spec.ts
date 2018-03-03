import { Action } from '@ngrx/store';
import {
  hikeEditMapMapReducer, wikipediaMarkerEntityInitialState, googleMarkerEntityInitialState, osmAmenityMarkerEntityInitialState, osmNaturalMarkerEntityInitialState, osmRouteMarkerEntityInitialState, initialMapState, hikeEditMapReducer, gTrackMarkerEntityInitialState
} from '../hike-edit-map';
import { IHikeEditMapState } from '../../state/hike-edit-map';
import { hikeEditMapActions, adminMapActions } from '../..';

describe('HikeEditMap reducers', () => {
  let initialState: IHikeEditMapState;
  let markers: any[];
  let entities: any;

  beforeEach(() => {
    initialState = {
      wikipediaMarkers: wikipediaMarkerEntityInitialState,
      googleMarkers: googleMarkerEntityInitialState,
      osmAmenityMarkers: osmAmenityMarkerEntityInitialState,
      osmNaturalMarkers: osmNaturalMarkerEntityInitialState,
      osmRouteMarkers: osmRouteMarkerEntityInitialState,
      gTrackMarkers: gTrackMarkerEntityInitialState,
      map: initialMapState
    };

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

      expect(state.map.mapId).toEqual('fakeId');
      // untouched props, good to add regardless
      expect(state.googleMarkers.ids).toEqual([]);
      expect(state.osmAmenityMarkers.ids).toEqual([]);
      expect(state.osmNaturalMarkers.ids).toEqual([]);
      expect(state.osmRouteMarkers.ids).toEqual([]);
      expect(state.wikipediaMarkers.ids).toEqual([]);
    });
  });

  describe('SetWikipediaMarkers action', () => {
    it('should set wikipedia markers', () => {
      const action = new hikeEditMapActions.SetWikipediaMarkers({ markers: markers });
      const state = hikeEditMapReducer(initialState, action);

      expect(state.wikipediaMarkers.entities).toEqual(entities);
    });
  });

  describe('SetGoogleMarkers action', () => {
    it('should set google markers', () => {
      const action = new hikeEditMapActions.SetGoogleMarkers({ markers: markers });
      const state = hikeEditMapReducer(initialState, action);

      expect(state.googleMarkers.entities).toEqual(entities);
    });
  });

  describe('SetOsmAmenityMarkers action', () => {
    it('should set osmAmenity markers', () => {
      const action = new hikeEditMapActions.SetOsmAmenityMarkers({ markers: markers });
      const state = hikeEditMapReducer(initialState, action);

      expect(state.osmAmenityMarkers.entities).toEqual(entities);
    });
  });

  describe('SetOsmNaturalMarkers action', () => {
    it('should set osmNatural markers', () => {
      const action = new hikeEditMapActions.SetOsmNaturalMarkers({ markers: markers });
      const state = hikeEditMapReducer(initialState, action);

      expect(state.osmNaturalMarkers.entities).toEqual(entities);
    });
  });

  describe('SetOsmRouteMarkers action', () => {
    it('should set osmRoute markers', () => {
      const action = new hikeEditMapActions.SetOsmRouteMarkers({ markers: markers });
      const state = hikeEditMapReducer(initialState, action);

      expect(state.osmRouteMarkers.entities).toEqual(entities);
    });
  });

  describe('SetGTrackMarkers action', () => {
    it('should set gTrack markers', () => {
      const action = new hikeEditMapActions.SetGTrackMarkers({ markers: markers });
      const state = hikeEditMapReducer(initialState, action);

      expect(state.gTrackMarkers.entities).toEqual(entities);
    });
  });
});
