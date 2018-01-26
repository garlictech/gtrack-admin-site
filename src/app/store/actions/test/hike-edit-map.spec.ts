import { TestBed } from '@angular/core/testing';
import * as HikeEditMapActions from '../hike-edit-map';

describe('HikeEditMap actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditMapActions.SET_GOOGLE_MARKERS).toEqual('[HikeEditMap] Set Google markers');
    expect(HikeEditMapActions.SET_OSM_AMENITY_MARKERS).toEqual('[HikeEditMap] Set OSM amenity markers');
    expect(HikeEditMapActions.SET_OSM_NATURAL_MARKERS).toEqual('[HikeEditMap] Set OSM natural markers');
    expect(HikeEditMapActions.SET_OSM_ROUTE_MARKERS).toEqual('[HikeEditMap] Set OSM route markers');
    expect(HikeEditMapActions.SET_WIKIPEDIA_MARKERS).toEqual('[HikeEditMap] Set Wikipedia markers');
 });

  it('should create GetGooglePois action', () => {
    let expectedClass = new HikeEditMapActions.SetGoogleMarkers({
      markers: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditMapActions.SET_GOOGLE_MARKERS);
  });

  it('should create SetOsmAmenityMarkers action', () => {
    let expectedClass = new HikeEditMapActions.SetOsmAmenityMarkers({
      markers: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditMapActions.SET_OSM_AMENITY_MARKERS);
  });

  it('should create SetOsmNaturalMarkers action', () => {
    let expectedClass = new HikeEditMapActions.SetOsmNaturalMarkers({
      markers: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditMapActions.SET_OSM_NATURAL_MARKERS);
  });

  it('should create SetOsmRouteMarkers action', () => {
    let expectedClass = new HikeEditMapActions.SetOsmRouteMarkers({
      markers: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditMapActions.SET_OSM_ROUTE_MARKERS);
  });

  it('should create SetWikipediaMarkers action', () => {
    let expectedClass = new HikeEditMapActions.SetWikipediaMarkers({
      markers: []
    });
    expect(expectedClass).toBeDefined();
    expect(expectedClass.type).toEqual(HikeEditMapActions.SET_WIKIPEDIA_MARKERS);
  });
});
