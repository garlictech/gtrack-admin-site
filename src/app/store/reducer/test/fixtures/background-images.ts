import { IBackgroundImageData, EPoiImageTypes, IBackgroundImageDataStored } from '../../../../../subrepos/provider-client';
import * as _ from 'lodash';

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
    photoReference: 'fakeReference',
  },
  additionalData: ''
};

const bgImageDataStored = _.merge({}, bgImageData, {
  id: '1'
});

export const bgImages: IBackgroundImageData[] = [bgImageData];
export const bgImagesStored: IBackgroundImageDataStored[] = [bgImageDataStored];
