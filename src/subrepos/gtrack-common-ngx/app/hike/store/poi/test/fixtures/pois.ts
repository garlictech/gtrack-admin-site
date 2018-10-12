import { IPoi, IPoiStored, EPoiTypes, EObjectState } from 'subrepos/provider-client';
import * as uuid from 'uuid/v4';

export const pois: IPoi[] = [
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

export const poisStored: IPoiStored[] = [
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
