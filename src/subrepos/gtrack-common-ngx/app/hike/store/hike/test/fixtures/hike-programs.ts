import * as uuid from 'uuid/v4';
import { IHikeProgramStored, IHikeProgram } from 'subrepos/provider-client';

export const hikePrograms: IHikeProgram[] = [
  {
    distance: 5,
    isRoundTrip: false,
    uphill: 1,
    downhill: 1,
    time: 20,
    score: 20,
    location: 'Budapest',
    difficulty: 'hard',
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
    pois: [],
    stops: []
  },
  {
    distance: 10,
    isRoundTrip: true,
    uphill: 20,
    downhill: 30,
    time: 15,
    score: 40,
    location: 'London',
    difficulty: 'easy',
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
    pois: [],
    stops: []
  }
];

export const hikeProgramsStored: IHikeProgramStored[] = [
  {
    ...hikePrograms[0],
    id: uuid(),
    timestamp: new Date().getTime()
  },
  {
    ...hikePrograms[1],
    id: uuid(),
    timestamp: new Date().getTime()
  }
];
