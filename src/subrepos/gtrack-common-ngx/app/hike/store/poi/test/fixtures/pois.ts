import { IPoi, IPoiStored, EPoiTypes } from 'subrepos/provider-client';
import * as uuid from 'uuid/v4';

export const pois: IPoi[] = [
  {
    lat: 42.25,
    lon: 19.32,
    elevation: 0,
    objectType: EPoiTypes.google,
    types: [],
    description: {}
  },
  {
    lat: 44.55,
    lon: -19.44,
    elevation: 0,
    objectType: EPoiTypes.google,
    types: [],
    description: {}
  }
];

export const poisStored: IPoiStored[] = [
  {
    ...pois[0],
    id: uuid(),
    timestamp: new Date().getTime()
  },
  {
    ...pois[1],
    id: uuid(),
    timestamp: new Date().getTime()
  }
]
