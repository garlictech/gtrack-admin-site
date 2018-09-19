import { EPoiTypes } from '../../../../../subrepos/provider-client';

export const pois = [
  {
    id: '1',
    selected: false,
    elevation: 0,
    lat: 0,
    lon: 0,
    objectType: EPoiTypes.google,
    types: [],
    description: {
      'en_US': {
        title: 'Title #1',
        summary: 'Summary #1',
        fullDescription: 'Description #1'
      }
    }
  },
  {
    id: '2',
    selected: false,
    elevation: 0,
    lat: 0,
    lon: 0,
    objectType: EPoiTypes.google,
    types: [],
    description: {
      'en_US': {
        title: 'Title #2',
        summary: 'Summary #2',
        fullDescription: 'Description #2'
      }
    }
  }
];

export const entities = {
  '1': pois[0],
  '2': pois[1]
};
