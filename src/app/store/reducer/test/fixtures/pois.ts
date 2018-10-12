import { EPoiTypes, ETextualDescriptionType } from '../../../../../subrepos/provider-client';

export const pois = [
  {
    id: '1',
    selected: false,
    inGtrackDb: false,
    inCollector: false,
    elevation: 0,
    lat: 0,
    lon: 0,
    objectTypes: [EPoiTypes.google],
    types: [],
    description: {
      'en_US': {
        title: 'Title #1',
        summary: 'Summary #1',
        fullDescription: 'Description #1',
        type: ETextualDescriptionType.markdown
      }
    },
    google: {
      photos: [{
        original: {
          url: 'fakeGoogleUrl1'
        }
      }]
    },
    wikipedia: {
      pageid: 'fakeWikipediaPageId1'
    }
  },
  {
    id: '2',
    selected: false,
    inGtrackDb: false,
    inCollector: false,
    elevation: 0,
    lat: 0,
    lon: 0,
    objectTypes: [EPoiTypes.google],
    types: [],
    description: {
      'en_US': {
        title: 'Title #2',
        summary: 'Summary #2',
        fullDescription: 'Description #2',
        type: ETextualDescriptionType.markdown
      }
    },
    google: {
      photos: [{
        original: {
          url: 'fakeGoogleUrl2'
        }
      }, {
        original: {
          url: 'fakeGoogleUrl3'
        }
      }]
    },
    wikipedia: {
      pageid: 'fakeWikipediaPageId2'
    }
  }
];

export const entities = {
  '1': pois[0],
  '2': pois[1]
};
