import * as uuid from 'uuid/v1';
import { GeoSearchResponseItem } from '../../state';

export const searches: Array<GeoSearchResponseItem> = [
  {
    id: uuid(),
    results: [uuid(), uuid()]
  },
  {
    id: uuid(),
    results: [uuid(), uuid(), uuid(), uuid()]
  }
];
