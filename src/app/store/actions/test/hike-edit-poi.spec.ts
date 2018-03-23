import { TestBed } from '@angular/core/testing';
import * as HikeEditPoiActions from '../hike-edit-poi';

describe('HikeEditPoi actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditPoiActions.RESET_POI_STATE).toEqual('[HikeEditPoi] Reset');

    expect(HikeEditPoiActions.GET_GOOGLE_POIS).toEqual('[HikeEditPoi] Get Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POIS).toEqual('[HikeEditPoi] Set Google pois');
    expect(HikeEditPoiActions.PATCH_GOOGLE_POIS).toEqual('[HikeEditPoi] Patch Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE).toEqual('[HikeEditPoi] Set Google poi inHike');

    expect(HikeEditPoiActions.GET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Get OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Set OSM amenity pois');
    expect(HikeEditPoiActions.PATCH_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Patch OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM amenity poi inHike');

    expect(HikeEditPoiActions.GET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Get OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Set OSM natural pois');
    expect(HikeEditPoiActions.PATCH_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Patch OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM natural poi inHike');

    expect(HikeEditPoiActions.GET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Get OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Set OSM route pois');
    expect(HikeEditPoiActions.PATCH_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Patch OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM route poi inHike');

    expect(HikeEditPoiActions.GET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Get Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Set Wikipedia pois');
    expect(HikeEditPoiActions.PATCH_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Patch Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POI_IN_HIKE).toEqual('[HikeEditPoi] Set Wikipedia poi inHike');

    expect(HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle onroute markers');
    expect(HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle offroute markers');
    expect(HikeEditPoiActions.MARKERS_CONFIG_CHANGED).toEqual('[HikeEditPoi] Markers config changed');
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
    const action = new HikeEditPoiActions.GetGooglePois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_GOOGLE_POIS,
      payload,
    });
  });

  it('should create SetGooglePois action', () => {
    const payload = { pois: [] };
    const action = new HikeEditPoiActions.SetGooglePois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_GOOGLE_POIS,
      payload,
    });
  });

  it('should create PatchGooglePois action', () => {
    const payload = { properties: [] };
    const action = new HikeEditPoiActions.PatchGooglePois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.PATCH_GOOGLE_POIS,
      payload,
    });
  });

  it('should create SetGooglePoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetGooglePoiInHike(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE,
      payload,
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
    const action = new HikeEditPoiActions.GetOsmAmenityPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_OSM_AMENITY_POIS,
      payload,
    });
  });

  it('should create SetOsmAmenityPois action', () => {
    const payload = { pois: [] };
    const action = new HikeEditPoiActions.SetOsmAmenityPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_AMENITY_POIS,
      payload,
    });
  });

  it('should create PatchOsmAmenityPois action', () => {
    const payload = { properties: [] };
    const action = new HikeEditPoiActions.PatchOsmAmenityPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.PATCH_OSM_AMENITY_POIS,
      payload,
    });
  });

  it('should create SetOsmAmenityPoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetOsmAmenityPoiInHike(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_AMENITY_POI_IN_HIKE,
      payload,
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
    const action = new HikeEditPoiActions.GetOsmNaturalPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_OSM_NATURAL_POIS,
      payload,
    });
  });

  it('should create SetOsmNaturalPois action', () => {
    const payload = { pois: [] };
    const action = new HikeEditPoiActions.SetOsmNaturalPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_NATURAL_POIS,
      payload,
    });
  });

  it('should create PatchOsmNaturalPois action', () => {
    const payload = { properties: [] };
    const action = new HikeEditPoiActions.PatchOsmNaturalPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.PATCH_OSM_NATURAL_POIS,
      payload,
    });
  });

  it('should create SetOsmNaturalPoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetOsmNaturalPoiInHike(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_NATURAL_POI_IN_HIKE,
      payload,
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
    const action = new HikeEditPoiActions.GetOsmRoutePois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_OSM_ROUTE_POIS,
      payload,
    });
  });

  it('should create SetOsmRoutePois action', () => {
    const payload = { pois: [] };
    const action = new HikeEditPoiActions.SetOsmRoutePois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_ROUTE_POIS,
      payload,
    });
  });

  it('should create PatchOsmRoutePois action', () => {
    const payload = { properties: [] };
    const action = new HikeEditPoiActions.PatchOsmRoutePois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.PATCH_OSM_ROUTE_POIS,
      payload,
    });
  });

  it('should create SetOsmRoutePoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetOsmRoutePoiInHike(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_OSM_ROUTE_POI_IN_HIKE,
      payload,
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
    const action = new HikeEditPoiActions.GetWikipediaPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.GET_WIKIPEDIA_POIS,
      payload,
    });
  });

  it('should create SetWikipediaPois action', () => {
    const payload = { pois: [] };
    const action = new HikeEditPoiActions.SetWikipediaPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_WIKIPEDIA_POIS,
      payload,
    });
  });

  it('should create PatchWikipediaPois action', () => {
    const payload = { properties: [] };
    const action = new HikeEditPoiActions.PatchWikipediaPois(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.PATCH_WIKIPEDIA_POIS,
      payload,
    });
  });

  it('should create SetWikipediaPoiInHike action', () => {
    const payload = {
      poiId: 'fakePoiId',
      isInHike: true
    };
    const action = new HikeEditPoiActions.SetWikipediaPoiInHike(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.SET_WIKIPEDIA_POI_IN_HIKE,
      payload,
    });
  });

  /**
   * Toggle markers
   */

  it('should create ToggleOnrouteMarkers action', () => {
    const payload = { subdomain: 'fakeDomain' };
    const action = new HikeEditPoiActions.ToggleOnrouteMarkers(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS,
      payload,
    });
  });

  it('should create ToggleOffrouteMarkers action', () => {
    const payload = { subdomain: 'fakeDomain' };
    const action = new HikeEditPoiActions.ToggleOffrouteMarkers(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS,
      payload,
    });
  });

  it('should create MarkersConfigChanged action', () => {
    const payload = { subdomain: 'fakeDomain' };
    const action = new HikeEditPoiActions.MarkersConfigChanged(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditPoiActions.MARKERS_CONFIG_CHANGED,
      payload,
    });
  });
});
