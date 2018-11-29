import * as HikeEditImageActions from '../hike-edit-image';

import { bgImages as bgImageFixtures } from '../../reducer/test/fixtures';

describe('HikeEditMap actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditImageActions.RESET_IMAGE_STATE).toEqual('[HikeEditImage] Reset images');
    expect(HikeEditImageActions.GET_MAPILLARY_IMAGES).toEqual('[HikeEditImage] Get Mapillary images');
    expect(HikeEditImageActions.SET_MAPILLARY_IMAGES).toEqual('[HikeEditImage] Set Mapillary images');
    expect(HikeEditImageActions.GET_FLICKR_IMAGES).toEqual('[HikeEditImage] Get Flickr images');
    expect(HikeEditImageActions.SET_FLICKR_IMAGES).toEqual('[HikeEditImage] Set Flickr images');
  });

  it('should create ResetImageState action', () => {
    const action = new HikeEditImageActions.ResetImageState();

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.RESET_IMAGE_STATE
    });
  });

  it('should create GetMapillaryImages action', () => {
    const bounds = 'fakeBounds';
    const path = 'fakePath';
    const action = new HikeEditImageActions.GetMapillaryImages(bounds, path);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.GET_MAPILLARY_IMAGES,
      bounds: bounds,
      path: path
    });
  });

  it('should create SetMapillaryImages action', () => {
    const action = new HikeEditImageActions.SetMapillaryImages([]);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.SET_MAPILLARY_IMAGES,
      images: []
    });
  });

  it('should create GetFlickrImages action', () => {
    const bounds = 'fakeBounds';
    const path = 'fakePath';
    const action = new HikeEditImageActions.GetFlickrImages(bounds, path);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.GET_FLICKR_IMAGES,
      bounds: bounds,
      path: path
    });
  });

  it('should create SetFlickrImages action', () => {
    const action = new HikeEditImageActions.SetFlickrImages([]);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.SET_FLICKR_IMAGES,
      images: []
    });
  });

  it('should create AddImageMarker action', () => {
    const bgImage = bgImageFixtures[0];
    const action = new HikeEditImageActions.AddImageMarker(bgImage);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.ADD_IMAGE_MARKER,
      image: bgImage
    });
  });

  it('should create AddImageMarkers action', () => {
    const bgImage = bgImageFixtures[0];
    const action = new HikeEditImageActions.AddImageMarkers([bgImage]);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.ADD_IMAGE_MARKERS,
      images: [bgImage]
    });
  });

  it('should create RemoveImageMarker action', () => {
    const bgImage = bgImageFixtures[0];
    const action = new HikeEditImageActions.RemoveImageMarker(bgImage);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.REMOVE_IMAGE_MARKER,
      image: bgImage
    });
  });

  it('should create RemoveImageMarkers action', () => {
    const bgImage = bgImageFixtures[0];
    const action = new HikeEditImageActions.RemoveImageMarkers([bgImage]);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.REMOVE_IMAGE_MARKERS,
      images: [bgImage]
    });
  });
});
