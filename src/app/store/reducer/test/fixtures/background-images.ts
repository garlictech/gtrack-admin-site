import { IBackgroundImageData, EPoiImageTypes } from '../../../../../subrepos/provider-client';

export const bgImages: IBackgroundImageData[] = [{
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
}];
