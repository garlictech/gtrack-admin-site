import { TestBed } from '@angular/core/testing';
import * as HikeEditPoiActions from '../hike-edit-poi';

describe('HikeEditPoi actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditPoiActions.GET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Get Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Set Wikipedia pois');
    expect(HikeEditPoiActions.GET_GOOGLE_POIS).toEqual('[HikeEditPoi] Get Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POIS).toEqual('[HikeEditPoi] Set Google pois');
    expect(HikeEditPoiActions.GET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Get OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Set OSM natural pois');
    expect(HikeEditPoiActions.GET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Get OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Set OSM amenity pois');
    expect(HikeEditPoiActions.GET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Get OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Set OSM route pois');
    expect(HikeEditPoiActions.SET_POI_IN_HIKE).toEqual('[HikeEditPoi] Set poi inHike');
    expect(HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle onroute markers');
    expect(HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle offroute markers');
    expect(HikeEditPoiActions.MARKERS_CONFIG_CHANGED).toEqual('[HikeEditPoi] Markers config changed');
  });

  it('should create GetWikipediaPois action', () => {
    let expectedClass = new HikeEditPoiActions.GetWikipediaPois({
      bounds: null,
      mapId: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.GET_WIKIPEDIA_POIS);
  });

  it('should create SetWikipediaPois action', () => {
    let expectedClass = new HikeEditPoiActions.SetWikipediaPois({
      pois: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_WIKIPEDIA_POIS);
  });

  it('should create GetGooglePois action', () => {
    let expectedClass = new HikeEditPoiActions.GetGooglePois({
      bounds: null,
      mapId: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.GET_GOOGLE_POIS);
  });

  it('should create SetGooglePois action', () => {
    let expectedClass = new HikeEditPoiActions.SetGooglePois({
      pois: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_GOOGLE_POIS);
  });

  it('should create GetOsmNaturalPois action', () => {
    let expectedClass = new HikeEditPoiActions.GetOsmNaturalPois({
      bounds: null,
      mapId: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.GET_OSM_NATURAL_POIS);
  });

  it('should create SetOsmNaturalPois action', () => {
    let expectedClass = new HikeEditPoiActions.SetOsmNaturalPois({
      pois: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_OSM_NATURAL_POIS);
  });

  it('should create GetOsmAmenityPois action', () => {
    let expectedClass = new HikeEditPoiActions.GetOsmAmenityPois({
      bounds: null,
      mapId: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.GET_OSM_AMENITY_POIS);
  });

  it('should create SetOsmAmenityPois action', () => {
    let expectedClass = new HikeEditPoiActions.SetOsmAmenityPois({
      pois: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_OSM_AMENITY_POIS);
  });

  it('should create GetOsmRoutePois action', () => {
    let expectedClass = new HikeEditPoiActions.GetOsmRoutePois({
      bounds: null,
      mapId: null
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.GET_OSM_ROUTE_POIS);
  });

  it('should create SetOsmRoutePois action', () => {
    let expectedClass = new HikeEditPoiActions.SetOsmRoutePois({
      pois: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_OSM_ROUTE_POIS);
  });

  it('should create SetPoiInHike action', () => {
    let expectedClass = new HikeEditPoiActions.SetPoiInHike({
      subdomain: 'fakeDomain',
      poiIdx: 1,
      isInHike: true
  });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_POI_IN_HIKE);
  });

  it('should create ToggleOnrouteMarkers action', () => {
    let expectedClass = new HikeEditPoiActions.ToggleOnrouteMarkers({
      subdomain: 'fakeDomain'
  });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS);
  });

  it('should create ToggleOffrouteMarkers action', () => {
    let expectedClass = new HikeEditPoiActions.ToggleOffrouteMarkers({
      subdomain: 'fakeDomain'
  });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS);
  });

  it('should create MarkersConfigChanged action', () => {
    let expectedClass = new HikeEditPoiActions.MarkersConfigChanged({
      subdomain: 'fakeDomain'
  });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.MARKERS_CONFIG_CHANGED);
  });
});
