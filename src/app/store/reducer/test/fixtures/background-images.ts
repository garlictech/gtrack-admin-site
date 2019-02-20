import * as _ from 'lodash';

import {
  BackgroundImageData,
  BackgroundImageDataStored,
  EPoiImageTypes
} from '../../../../../subrepos/provider-client';

const bgImageData = {
  title: 'fakeImageTitle',
  lat: 0,
  lon: 0,
  original: {
    url: 'fakeOriginalUrl',
    width: 100,
    height: 100
  },
  card: {
    url: 'fakeCardUrl',
    width: 100,
    height: 100
  },
  thumbnail: {
    url: 'fakeThumbnailUrl',
    width: 100,
    height: 100
  },
  source: {
    type: EPoiImageTypes.google,
    poiObjectId: 'fakeGoogleObjectId',
    photoReference: 'fakeReference'
  },
  additionalData: ''
};

const bgImageDataStored = _.merge({}, bgImageData, {
  id: '1'
});

export const bgImages: Array<BackgroundImageData> = [bgImageData];
export const bgImagesStored: Array<BackgroundImageDataStored> = [bgImageDataStored];
