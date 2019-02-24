import { EObjectState, EPoiTypes, PoiData, PoiStored } from '@features/common/gtrack-interfaces';
import * as uuid from 'uuid/v4';

export const pois: Array<PoiData> = [
  {
    id: uuid(),
    lat: 42.25,
    lon: 19.32,
    elevation: 150,
    objectTypes: [EPoiTypes.google],
    types: ['stop'],
    description: {
      en_US: {
        title: 'Test poi 1'
      }
    }
  },
  {
    id: uuid(),
    lat: 44.55,
    lon: -19.44,
    elevation: 252.1,
    objectTypes: [EPoiTypes.osmAmenity],
    types: ['atm'],
    description: {
      en_US: {
        title: 'Test poi 2'
      }
    }
  }
];

export const poisStored: Array<PoiStored> = [
  {
    ...pois[0],
    id: uuid(),
    timestamp: new Date().getTime(),
    state: EObjectState.draft
  },
  {
    ...pois[1],
    id: uuid(),
    timestamp: new Date().getTime(),
    state: EObjectState.draft
  }
];
