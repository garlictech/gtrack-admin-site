import { TestBed } from '@angular/core/testing';
import { EPoiTypes } from '../../../../subrepos/provider-client';

import * as HikeEditPoiActions from '../hike-edit-poi';

describe('HikeEditPoi actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditPoiActions.RESET_POI_STATE).toEqual('[HikeEditPoi] Reset');

    expect(HikeEditPoiActions.GET_GOOGLE_POIS).toEqual('[HikeEditPoi] Get Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POIS).toEqual('[HikeEditPoi] Set Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set Google pois inGtrackDb');
    expect(HikeEditPoiActions.SET_GOOGLE_POIS_IN_COLLECTOR).toEqual('[HikeEditPoi] Set Google pois inCollector');
    expect(HikeEditPoiActions.SET_GOOGLE_POI_SELECTED).toEqual('[HikeEditPoi] Set Google poi selected');

    expect(HikeEditPoiActions.GET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Get OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Set OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set OSM amenity pois inGtrackDb');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POIS_IN_COLLECTOR).toEqual('[HikeEditPoi] Set OSM amenity pois inCollector');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POI_SELECTED).toEqual('[HikeEditPoi] Set OSM amenity poi selected');

    expect(HikeEditPoiActions.GET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Get OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Set OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set OSM natural pois inGtrackDb');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POIS_IN_COLLECTOR).toEqual('[HikeEditPoi] Set OSM natural pois inCollector');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POI_SELECTED).toEqual('[HikeEditPoi] Set OSM natural poi selected');

    expect(HikeEditPoiActions.GET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Get OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Set OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set OSM route pois inGtrackDb');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POIS_IN_COLLECTOR).toEqual('[HikeEditPoi] Set OSM route pois inCollector');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POI_SELECTED).toEqual('[HikeEditPoi] Set OSM route poi selected');

    expect(HikeEditPoiActions.GET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Get Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Set Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POIS_IN_GTRACK_DB).toEqual('[HikeEditPoi] Set Wikipedia pois inGtrackDb');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POIS_IN_COLLECTOR).toEqual('[HikeEditPoi] Set Wikipedia pois inCollector');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POI_SELECTED).toEqual('[HikeEditPoi] Set Wikipedia poi selected');

    expect(HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle onroute markers');
    expect(HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle offroute markers');
    expect(HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle offroute markers');

    expect(HikeEditPoiActions.ADD_POIS_TO_COLLECTOR).toEqual('[HikeEditPoi] Add pois to collector');
    expect(HikeEditPoiActions.REMOVE_POIS_FROM_COLLECTOR).toEqual('[HikeEditPoi] Remove pois from collector');
    expect(HikeEditPoiActions.SET_COLLECTOR_POI_SELECTED).toEqual('[HikeEditPoi] Set collector poi selected');

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

  it('should create SetGooglePoisInGtrackDb action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetGooglePoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_GOOGLE_POIS_IN_GTRACK_DB,
      properties: properties
    });
  });

  it('should create SetGooglePoisInCollector action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetGooglePoisInCollector(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_GOOGLE_POIS_IN_COLLECTOR,
      properties: properties
    });
  });

  it('should create SetGooglePoiSelected action', () => {
    const payload = {
      poiId: 'fakePoiId'
    };
    const action = new HikeEditPoiActions.SetGooglePoiSelected(payload.poiId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_GOOGLE_POI_SELECTED,
      poiId: payload.poiId
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

  it('should create SetOsmAmenityPoisInGtrackDb action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmAmenityPoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_AMENITY_POIS_IN_GTRACK_DB,
      properties: properties,
    });
  });

  it('should create SetOsmAmenityPoisInCollector action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmAmenityPoisInCollector(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_AMENITY_POIS_IN_COLLECTOR,
      properties: properties,
    });
  });

  it('should create SetOsmAmenityPoiSelected action', () => {
    const payload = {
      poiId: 'fakePoiId'
    };
    const action = new HikeEditPoiActions.SetOsmAmenityPoiSelected(payload.poiId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_AMENITY_POI_SELECTED,
      poiId: payload.poiId
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

  it('should create SetOsmNaturalPoisInGtrackDb action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmNaturalPoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_NATURAL_POIS_IN_GTRACK_DB,
      properties: properties
    });
  });

  it('should create SetOsmNaturalPoisInCollector action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmNaturalPoisInCollector(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_NATURAL_POIS_IN_COLLECTOR,
      properties: properties
    });
  });

  it('should create SetOsmNaturalPoiSelected action', () => {
    const payload = {
      poiId: 'fakePoiId'
    };
    const action = new HikeEditPoiActions.SetOsmNaturalPoiSelected(payload.poiId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_NATURAL_POI_SELECTED,
      poiId: payload.poiId
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

  it('should create SetOsmRoutePoisInGtrackDb action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmRoutePoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_ROUTE_POIS_IN_GTRACK_DB,
      properties: properties,
    });
  });

  it('should create SetOsmRoutePoisInCollector action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetOsmRoutePoisInCollector(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_ROUTE_POIS_IN_COLLECTOR,
      properties: properties,
    });
  });

  it('should create SetOsmRoutePoiSelected action', () => {
    const payload = {
      poiId: 'fakePoiId'
    };
    const action = new HikeEditPoiActions.SetOsmRoutePoiSelected(payload.poiId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_ROUTE_POI_SELECTED,
      poiId: payload.poiId
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

  it('should create SetWikipediaPoisInGtrackDb action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetWikipediaPoisInGtrackDb(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_WIKIPEDIA_POIS_IN_GTRACK_DB,
      properties: properties,
    });
  });

  it('should create SetWikipediaPoisInCollector action', () => {
    const properties = [];
    const action = new HikeEditPoiActions.SetWikipediaPoisInCollector(properties);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_WIKIPEDIA_POIS_IN_COLLECTOR,
      properties: properties,
    });
  });

  it('should create SetWikipediaPoiSelected action', () => {
    const payload = {
      poiId: 'fakePoiId'
    };
    const action = new HikeEditPoiActions.SetWikipediaPoiSelected(payload.poiId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_WIKIPEDIA_POI_SELECTED,
      poiId: payload.poiId
    });
  });

  /**
   * Collector
   */

  it('should create AddPoisToCollector action', () => {
    const pois = ['fakePoi'];
    const action = new HikeEditPoiActions.AddPoisToCollector(pois);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.ADD_POIS_TO_COLLECTOR,
      pois: pois
    });
  });

  it('should create AddPoisToCollector action', () => {
    const poiIds = ['fakeId'];
    const action = new HikeEditPoiActions.RemovePoisFromCollector(poiIds);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.REMOVE_POIS_FROM_COLLECTOR,
      poiIds: poiIds
    });
  });

  it('should create AddPoisToCollector action', () => {
    const poiId = 'fakeId';
    const action = new HikeEditPoiActions.SetCollectorPoiSelected(poiId);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_COLLECTOR_POI_SELECTED,
      poiId: poiId
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
