import { TestBed } from '@angular/core/testing';
import * as HikeEditMapActions from '../hike-edit-map';

describe('HikeEditMap actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditMapActions.RESET_MAP_STATE).toEqual('[HikeEditMap] Reset');
    expect(HikeEditMapActions.SET_GOOGLE_MARKERS).toEqual('[HikeEditMap] Set Google markers');
    expect(HikeEditMapActions.SET_OSM_AMENITY_MARKERS).toEqual('[HikeEditMap] Set OSM amenity markers');
    expect(HikeEditMapActions.SET_OSM_NATURAL_MARKERS).toEqual('[HikeEditMap] Set OSM natural markers');
    expect(HikeEditMapActions.SET_OSM_ROUTE_MARKERS).toEqual('[HikeEditMap] Set OSM route markers');
    expect(HikeEditMapActions.SET_WIKIPEDIA_MARKERS).toEqual('[HikeEditMap] Set Wikipedia markers');
    expect(HikeEditMapActions.SET_GTRACK_MARKERS).toEqual('[HikeEditMap] Set gTrack markers');
 });

  it('should create Reset action', () => {
    const action = new HikeEditMapActions.ResetMapState();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditMapActions.RESET_MAP_STATE
    });
  });

  it('should create GetGooglePois action', () => {
    const payload = { markers: [] };
    const action = new HikeEditMapActions.SetGoogleMarkers(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditMapActions.SET_GOOGLE_MARKERS,
      payload
    });
  });

  it('should create SetOsmAmenityMarkers action', () => {
    const payload = { markers: [] };
    const action = new HikeEditMapActions.SetOsmAmenityMarkers(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditMapActions.SET_OSM_AMENITY_MARKERS,
      payload
    });
  });

  it('should create SetOsmNaturalMarkers action', () => {
    const payload = { markers: [] };
    const action = new HikeEditMapActions.SetOsmNaturalMarkers(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditMapActions.SET_OSM_NATURAL_MARKERS,
      payload
    });
  });

  it('should create SetOsmRouteMarkers action', () => {
    const payload = { markers: [] };
    const action = new HikeEditMapActions.SetOsmRouteMarkers(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditMapActions.SET_OSM_ROUTE_MARKERS,
      payload
    });
  });

  it('should create SetWikipediaMarkers action', () => {
    const payload = { markers: [] };
    const action = new HikeEditMapActions.SetWikipediaMarkers(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditMapActions.SET_WIKIPEDIA_MARKERS,
      payload
    });
  });

  it('should create SetGTrackMarkers action', () => {
    const payload = { markers: [] };
    const action = new HikeEditMapActions.SetGTrackMarkers(payload);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditMapActions.SET_GTRACK_MARKERS,
      payload
    });
  });
});
