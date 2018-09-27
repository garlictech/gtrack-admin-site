
import { IHikeProgram } from 'subrepos/provider-client';
import * as uuid from 'uuid/v4';

export const hikePrograms: IHikeProgram[] = [
  {
    id: uuid(),
    distance: 5,
    isRoundTrip: false,
    uphill: 1,
    downhill: 1,
    time: 20,
    score: 20,
    location: 'Budapest',
    difficulty: 5,
    feature: true,
    routeIcon: '',
    elevationIcon: '',
    routeId: uuid(),
    description: {
      en_US: {
        fullDescription: 'Test hike',
        title: 'Test hike',
        summary: 'Test hike'
      }
    },
    stops: []
  },
  {
    id: uuid(),
    distance: 10,
    isRoundTrip: true,
    uphill: 20,
    downhill: 30,
    time: 15,
    score: 40,
    location: 'London',
    difficulty: 1,
    feature: true,
    routeIcon: '',
    elevationIcon: '',
    routeId: uuid(),
    description: {
      en_US: {
        fullDescription: 'Test hike 2',
        title: 'Test hike 2',
        summary: 'Test hike 2'
      }
    },
    stops: []
  }
];
