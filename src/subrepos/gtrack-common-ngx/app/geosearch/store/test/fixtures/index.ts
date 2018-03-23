import * as uuid from 'uuid/v1';
import { IGeoSearchResponseItem } from '../../state';

export const searches: IGeoSearchResponseItem[] = [
  {
    id: uuid(),
    results: [
      uuid(),
      uuid()
    ]
  },
  {
    id: uuid(),
    results: [
      uuid(),
      uuid(),
      uuid(),
      uuid()
    ]
  }
];
