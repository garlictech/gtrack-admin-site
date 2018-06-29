import { TestBed } from '@angular/core/testing';
import { EPoiTypes } from 'subrepos/provider-client';

import * as HikeEditPoiActions from '../hike-edit-poi';

describe('HikeEditPoi actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditPoiActions.RESET_POI_STATE).toEqual('[HikeEditPoi] Reset');

    expect(HikeEditPoiActions.GET_GOOGLE_POIS).toEqual('[HikeEditPoi] Get Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POIS).toEqual('[HikeEditPoi] Set Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set Google pois inGtrackDb');
    expect(HikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE).toEqual('[HikeEditPoi] Set Google poi inHike');

    expect(HikeEditPoiActions.GET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Get OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Set OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set OSM amenity pois inGtrackDb');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM amenity poi inHike');

    expect(HikeEditPoiActions.GET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Get OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Set OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set OSM natural pois inGtrackDb');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM natural poi inHike');

    expect(HikeEditPoiActions.GET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Get OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Set OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set OSM route pois inGtrackDb');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM route poi inHike');

    expect(HikeEditPoiActions.GET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Get Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Set Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set Wikipedia pois inGtrackDb');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POI_IN_HIKE).toEqual('[HikeEditPoi] Set Wikipedia poi inHike');

    expect(HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle onroute markers');
    expect(HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle offroute markers');
    expect(HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle offroute markers');

    expect(HikeEditPoiActions.SET_SAVING).toEqual('[HikeEditPoi] Set saving');
    expect(HikeEditPoiActions.SET_LOADING).toEqual('[HikeEditPoi] Set loading');
  });

  /**
   * Reset
   */

  it('should create Reset action', () => {
    const action = new HikeEditPoiActions.ResetPoiState();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.RESET_POI_STATE
    });
  });

  /**
   * Google pois
   */

  it('should create GetGooglePois action', () => {
    const payload = {
      bounds: null,
      mapId: 'fakeMapId'
    };
    const action = new HikeEditPoiActions.GetGooglePois(payload.bounds, payload.mapId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_GOOGLE_POIS,
      bounds: payload.bounds,
      mapId: payload.mapId
    });
  });

  it('should create SetGooglePois action', () => {
    const pois = [];
    const action = new HikeEditPoiActions.SetGooglePois(pois);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_GOOGLE_POIS,
      pois: pois
    });
  });

  it('should create PatchGooglePois action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetGooglePoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_GOOGLE_POIS_IN_GTRACK_DB,
      properties: properties
    });
  });

  it('should create SetGooglePoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetGooglePoiInHike(payload.poiId, payload.isInHike);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE,
      poiId: payload.poiId,
      isInHike: payload.isInHike
    });
  });

  /**
   * OSM amenity pois
   */

  it('should create GetOsmAmenityPois action', () => {
    const payload = {
      bounds: null,
      mapId: 'fakeMapId'
    };
    const action = new HikeEditPoiActions.GetOsmAmenityPois(payload.bounds, payload.mapId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_OSM_AMENITY_POIS,
      bounds: payload.bounds,
      mapId: payload.mapId
    });
  });

  it('should create SetOsmAmenityPois action', () => {
    const pois = [];
    const action = new HikeEditPoiActions.SetOsmAmenityPois(pois);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_AMENITY_POIS,
      pois: pois,
    });
  });

  it('should create PatchOsmAmenityPois action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmAmenityPoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_AMENITY_POIS_IN_GTRACK_DB,
      properties: properties,
    });
  });

  it('should create SetOsmAmenityPoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetOsmAmenityPoiInHike(payload.poiId, payload.isInHike);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_AMENITY_POI_IN_HIKE,
      poiId: payload.poiId,
      isInHike: payload.isInHike
    });
  });

  /**
   * OSM natural pois
   */

  it('should create GetOsmNaturalPois action', () => {
    const payload = {
      bounds: null,
      mapId: 'fakeMapId'
    };
    const action = new HikeEditPoiActions.GetOsmNaturalPois(payload.bounds, payload.mapId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_OSM_NATURAL_POIS,
      bounds: payload.bounds,
      mapId: payload.mapId
    });
  });

  it('should create SetOsmNaturalPois action', () => {
    const pois = [];
    const action = new HikeEditPoiActions.SetOsmNaturalPois(pois);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_NATURAL_POIS,
      pois: pois,
    });
  });

  it('should create PatchOsmNaturalPois action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmNaturalPoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_NATURAL_POIS_IN_GTRACK_DB,
      properties: properties
    });
  });

  it('should create SetOsmNaturalPoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetOsmNaturalPoiInHike(payload.poiId, payload.isInHike);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_NATURAL_POI_IN_HIKE,
      poiId: payload.poiId,
      isInHike: payload.isInHike
    });
  });

  /**
   * OSM route pois
   */

  it('should create GetOsmRoutePois action', () => {
    const payload = {
      bounds: null,
      mapId: 'fakeMapId'
    };
    const action = new HikeEditPoiActions.GetOsmRoutePois(payload.bounds, payload.mapId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_OSM_ROUTE_POIS,
      bounds: payload.bounds,
      mapId: payload.mapId
    });
  });

  it('should create SetOsmRoutePois action', () => {
    const pois = [];
    const action = new HikeEditPoiActions.SetOsmRoutePois(pois);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_ROUTE_POIS,
      pois: pois,
    });
  });

  it('should create PatchOsmRoutePois action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmRoutePoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_ROUTE_POIS_IN_GTRACK_DB,
      properties: properties,
    });
  });

  it('should create SetOsmRoutePoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetOsmRoutePoiInHike(payload.poiId, payload.isInHike);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_ROUTE_POI_IN_HIKE,
      poiId: payload.poiId,
      isInHike: payload.isInHike
    });
  });

  /**
   * Wikipedia pois
   */

  it('should create GetWikipediaPois action', () => {
    const payload = {
      bounds: null,
      mapId: 'fakeMapId'
    };
    const action = new HikeEditPoiActions.GetWikipediaPois(payload.bounds, payload.mapId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_WIKIPEDIA_POIS,
      bounds: payload.bounds,
      mapId: payload.mapId
    });
  });

  it('should create SetWikipediaPois action', () => {
    const pois = [];
    const action = new HikeEditPoiActions.SetWikipediaPois(pois);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_WIKIPEDIA_POIS,
      pois: pois,
    });
  });

  it('should create PatchWikipediaPois action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetWikipediaPoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_WIKIPEDIA_POIS_IN_GTRACK_DB,
      properties: properties,
    });
  });

  it('should create SetWikipediaPoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetWikipediaPoiInHike(payload.poiId, payload.isInHike);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_WIKIPEDIA_POI_IN_HIKE,
      poiId: payload.poiId,
      isInHike: payload.isInHike
    });
  });

  /**
   * Toggle markers
   */

  it('should create ToggleOnrouteMarkers action', () => {
    const subdomain = 'fakeDomain';
    const action = new HikeEditPoiActions.ToggleOnrouteMarkers(subdomain);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS,
      subdomain: subdomain,
    });
  });

  it('should create ToggleOffrouteMarkers action', () => {
    const subdomain = 'fakeDomain';
    const action = new HikeEditPoiActions.ToggleOffrouteMarkers(subdomain);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS,
      subdomain: subdomain,
    });
  });

  it('should create MarkersConfigChanged action', () => {
    const action = new HikeEditPoiActions.MarkersConfigChanged();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.MARKERS_CONFIG_CHANGED
    });
  });

  it('should create SetSaving action', () => {
    const action = new HikeEditPoiActions.SetSaving(EPoiTypes.google, true);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_SAVING,
      subdomain: EPoiTypes.google,
      saving: true
    });
  });

  it('should create SetLoading action', () => {
    const action = new HikeEditPoiActions.SetLoading(EPoiTypes.google);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_LOADING,
      subdomain: EPoiTypes.google
    });
  });
});
