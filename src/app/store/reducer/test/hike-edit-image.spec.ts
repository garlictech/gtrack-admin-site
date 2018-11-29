import { IHikeEditImageState } from '../../state';
import {
  mapillaryImageInitialState,
  initialImageMarkerState,
  imageListInitialContextState,
  hikeEditImageReducer
} from '../hike-edit-image';
import { hikeEditImageActions } from '../../actions';
import { IBackgroundImageData, IBackgroundImageDataStored } from '../../../../subrepos/provider-client';

import * as _ from 'lodash';

import { bgImages as bgImageFixtures, bgImagesStored as bgImageStoredFixtures } from './fixtures';

describe('HikeEditImage reducers', () => {
  let initialState: IHikeEditImageState;
  let images: IBackgroundImageData[];
  let imagesStored: IBackgroundImageDataStored[];

  beforeEach(() => {
    initialState = {
      mapillaryImages: mapillaryImageInitialState,
      flickrImages: mapillaryImageInitialState,
      imageMarkerImages: initialImageMarkerState,
      contexts: imageListInitialContextState
    };

    images = _.cloneDeep(bgImageFixtures);
    imagesStored = _.cloneDeep(bgImageStoredFixtures);
  });

  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;
      const state = hikeEditImageReducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('ResetImageState action', () => {
    it('should reset state', () => {
      const action = new hikeEditImageActions.ResetImageState();
      const state = hikeEditImageReducer(initialState, action);

      expect(state.mapillaryImages).toEqual(mapillaryImageInitialState);
      expect(state.imageMarkerImages).toEqual(initialImageMarkerState);
      expect(state.contexts).toEqual(imageListInitialContextState);
    });
  });

  describe('SetMapillaryImages action', () => {
    it('should set mapillary images', () => {
      const action = new hikeEditImageActions.SetMapillaryImages(imagesStored);
      const state = hikeEditImageReducer(initialState, action);

      expect(state.mapillaryImages.entities['1']).toEqual(imagesStored[0]);
      expect(state.mapillaryImages.ids).toEqual(['1']);
    });

    it('should clear mapillary images', () => {
      const action = new hikeEditImageActions.SetMapillaryImages([]);
      const state = hikeEditImageReducer(initialState, action);

      expect(state.mapillaryImages.entities).toEqual({});
      expect(state.mapillaryImages.ids).toEqual([]);
    });
  });

  describe('AddImageMarker action', () => {
    it('should add image marker', () => {
      const action = new hikeEditImageActions.AddImageMarker(imagesStored[0]);
      const state = hikeEditImageReducer(initialState, action);

      expect(state.imageMarkerImages.images).toEqual([imagesStored[0]]);
    });
  });

  describe('AddImageMarkers action', () => {
    it('should add image markers', () => {
      const action = new hikeEditImageActions.AddImageMarkers([imagesStored[0]]);
      const state = hikeEditImageReducer(initialState, action);

      expect(state.imageMarkerImages.images).toEqual([imagesStored[0]]);
    });
  });

  describe('RemoveImageMarker action', () => {
    it('should remove image marker', () => {
      const action = new hikeEditImageActions.RemoveImageMarker(imagesStored[0]);
      const state = hikeEditImageReducer(
        _.merge({}, initialState, {
          imageMarkerImages: {
            images: [imagesStored[0]]
          }
        }),
        action
      );

      expect(state.imageMarkerImages.images).toEqual([]);
    });
  });

  describe('RemoveImageMarkers action', () => {
    it('should remove image marker', () => {
      const action = new hikeEditImageActions.RemoveImageMarkers([imagesStored[0]]);
      const state = hikeEditImageReducer(
        _.merge({}, initialState, {
          imageMarkerImages: {
            images: [imagesStored[0]]
          }
        }),
        action
      );

      expect(state.imageMarkerImages.images).toEqual([]);
    });
  });

  describe('GetMapillaryImages action', () => {
    it('should get mapillary images', () => {
      const action = new hikeEditImageActions.GetMapillaryImages('fakeBounds', 'fakePath');
      const state = hikeEditImageReducer(initialState, action);

      expect(state.contexts.mapillary.loading).toBeTruthy();
      expect(state.contexts.mapillary.loaded).toBeFalsy();
    });
  });

  describe('SetMapillaryImages action', () => {
    it('should set mapillary images', () => {
      const action = new hikeEditImageActions.SetMapillaryImages([]);
      const state = hikeEditImageReducer(initialState, action);

      expect(state.contexts.mapillary.loading).toBeFalsy();
      expect(state.contexts.mapillary.loaded).toBeTruthy();
    });
  });

  describe('GetFlickrImages action', () => {
    it('should get flickr images', () => {
      const action = new hikeEditImageActions.GetFlickrImages('fakeBounds', 'fakePath');
      const state = hikeEditImageReducer(initialState, action);

      expect(state.contexts.flickr.loading).toBeTruthy();
      expect(state.contexts.flickr.loaded).toBeFalsy();
    });
  });

  describe('SetFlickrImages action', () => {
    it('should set flickr images', () => {
      const action = new hikeEditImageActions.SetFlickrImages([]);
      const state = hikeEditImageReducer(initialState, action);

      expect(state.contexts.flickr.loading).toBeFalsy();
      expect(state.contexts.flickr.loaded).toBeTruthy();
    });
  });
});
