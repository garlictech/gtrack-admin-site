import { TestBed } from '@angular/core/testing';
import * as HikeEditPoiActions from '../hike-edit-poi';

describe('HikeEditPoi actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditPoiActions.GET_GOOGLE_POIS).toEqual('[HikeEditPoi] Get Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POIS).toEqual('[HikeEditPoi] Set Google pois');
    expect(HikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE).toEqual('[HikeEditPoi] Set Google poi inHike');

    expect(HikeEditPoiActions.GET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Get OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POIS).toEqual('[HikeEditPoi] Set OSM amenity pois');
    expect(HikeEditPoiActions.SET_OSM_AMENITY_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM amenity poi inHike');

    expect(HikeEditPoiActions.GET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Get OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POIS).toEqual('[HikeEditPoi] Set OSM natural pois');
    expect(HikeEditPoiActions.SET_OSM_NATURAL_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM natural poi inHike');

    expect(HikeEditPoiActions.GET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Get OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POIS).toEqual('[HikeEditPoi] Set OSM route pois');
    expect(HikeEditPoiActions.SET_OSM_ROUTE_POI_IN_HIKE).toEqual('[HikeEditPoi] Set OSM route poi inHike');

    expect(HikeEditPoiActions.GET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Get Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POIS).toEqual('[HikeEditPoi] Set Wikipedia pois');
    expect(HikeEditPoiActions.SET_WIKIPEDIA_POI_IN_HIKE).toEqual('[HikeEditPoi] Set Wikipedia poi inHike');

    expect(HikeEditPoiActions.TOGGLE_ONROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle onroute markers');
    expect(HikeEditPoiActions.TOGGLE_OFFROUTE_MARKERS).toEqual('[HikeEditPoi] Toggle offroute markers');
    expect(HikeEditPoiActions.GENERATE_SUBDOMAIN_POI_MARKERS).toEqual('[HikeEditPoi] Generate subdomain poi markers');
    expect(HikeEditPoiActions.MARKERS_CONFIG_CHANGED).toEqual('[HikeEditPoi] Markers config changed');
  });

  /**
   * Google pois
   */

  it('should create GetGooglePois action', () => {
    let expectedClass = new HikeEditPoiActions.GetGooglePois({
      bounds: null,
      mapId: 'fakeId'
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

  it('should create SetGooglePoiInHike action', () => {
    let expectedClass = new HikeEditPoiActions.SetGooglePoiInHike({
      poiId: 'fakeId',
      isInHike: true
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_GOOGLE_POI_IN_HIKE);
  });

  /**
   * OSM amenity pois
   */

  it('should create GetOsmAmenityPois action', () => {
    let expectedClass = new HikeEditPoiActions.GetOsmAmenityPois({
      bounds: null,
      mapId: 'fakeId'
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

  it('should create SetOsmAmenityPoiInHike action', () => {
    let expectedClass = new HikeEditPoiActions.SetOsmAmenityPoiInHike({
      poiId: 'fakeId',
      isInHike: true
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_OSM_AMENITY_POI_IN_HIKE);
  });

  /**
   * OSM natural pois
   */

  it('should create GetOsmNaturalPois action', () => {
    let expectedClass = new HikeEditPoiActions.GetOsmNaturalPois({
      bounds: null,
      mapId: 'fakeId'
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

  it('should create SetOsmNaturalPoiInHike action', () => {
    let expectedClass = new HikeEditPoiActions.SetOsmNaturalPoiInHike({
      poiId: 'fakeId',
      isInHike: true
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_OSM_NATURAL_POI_IN_HIKE);
  });

  /**
   * OSM route pois
   */

  it('should create GetOsmRoutePois action', () => {
    let expectedClass = new HikeEditPoiActions.GetOsmRoutePois({
      bounds: null,
      mapId: 'fakeId'
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

  it('should create SetOsmRoutePoiInHike action', () => {
    let expectedClass = new HikeEditPoiActions.SetOsmRoutePoiInHike({
      poiId: 'fakeId',
      isInHike: true
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_OSM_ROUTE_POI_IN_HIKE);
  });

  /**
   * Wikipedia pois
   */

  it('should create GetWikipediaPois action', () => {
    let expectedClass = new HikeEditPoiActions.GetWikipediaPois({
      bounds: null,
      mapId: 'fakeId'
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

  it('should create SetWikipediaPoiInHike action', () => {
    let expectedClass = new HikeEditPoiActions.SetWikipediaPoiInHike({
      poiId: 'fakeId',
      isInHike: true
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.SET_WIKIPEDIA_POI_IN_HIKE);
  });

  /**
   * Toggle markers
   */

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

  it('should create GenerateSubdomainPoiMarkers action', () => {
    let expectedClass = new HikeEditPoiActions.GenerateSubdomainPoiMarkers({
      subdomain: 'fakeDomain'
  });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.GENERATE_SUBDOMAIN_POI_MARKERS);
  });

  it('should create MarkersConfigChanged action', () => {
    let expectedClass = new HikeEditPoiActions.MarkersConfigChanged({
      subdomain: 'fakeDomain'
  });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditPoiActions.MARKERS_CONFIG_CHANGED);
  });
});
