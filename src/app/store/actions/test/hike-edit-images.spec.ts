import * as HikeEditImageActions from '../hike-edit-image';

describe('HikeEditMap actions', () => {
  it('should have action names defined', () => {
    expect(HikeEditImageActions.RESET_IMAGE_STATE).toEqual('[HikeEditImage] Reset images');
    expect(HikeEditImageActions.GET_MAPILLARY_IMAGES).toEqual('[HikeEditImage] Get Mapillary images');
    expect(HikeEditImageActions.SET_MAPILLARY_IMAGES).toEqual('[HikeEditImage] Set Mapillary images');
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
    const action = new HikeEditImageActions.GetMapillaryImages(bounds);

    expect(action).toBeDefined();
    expect({ ...action }).toEqual({
      type: HikeEditImageActions.GET_MAPILLARY_IMAGES,
      bounds: bounds
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
});
