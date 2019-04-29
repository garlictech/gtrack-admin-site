import {
  EObjectState,
  HikeProgramData,
  HikeProgramStored
} from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import * as uuid from 'uuid/v4';

export const hikePrograms: Array<HikeProgramData> = [
  {
    id: uuid(),
    distance: 5,
    isRoundTrip: false,
    uphill: 1,
    downhill: 1,
    time: 20,
    score: 20,
    reverseScore: 30,
    reverseTime: 30,
    location: 'Budapest',
    difficulty: 5,
    feature: true,
    routeIcon: '',
    elevationIcon: '',
    routeId: uuid(),
    description: {
      en_US: {
        fullDescription: 'Test hike desc',
        title: 'Test hike title',
        summary: 'Test hike summary'
      }
    },
    teaser: {
      en_US: {
        fullDescription: 'Test hike teaser',
        title: 'Test hike teaser title',
        summary: 'Test hike teaser summary'
      }
    },
    stops: [
      {
        distanceFromOrigo: 0,
        onRoute: true,
        poiId: 'endpoint-start',
        lat: 47.7215,
        lon: 18.8753,
        isStart: true,
        segment: {
          uphill: 500,
          downhill: 300,
          distance: 500,
          time: 58,
          score: 100
        }
      },
      {
        distanceFromOrigo: 200,
        onRoute: true,
        poiId: uuid(),
        lat: 47.2115,
        lon: 18.7353,
        segment: {
          uphill: 150,
          downhill: 10,
          distance: 400,
          time: 20,
          score: 60
        }
      },
      {
        distanceFromOrigo: 500,
        onRoute: true,
        poiId: 'endpoint-finish',
        isFinish: true,
        lat: 47.2115,
        lon: 18.7353,
        segment: {
          uphill: 900,
          downhill: 10,
          distance: 20,
          time: 38,
          score: 50
        }
      }
    ],
    reverseStops: [
      {
        distanceFromOrigo: 500,
        onRoute: true,
        poiId: 'endpoint-start',
        isStart: true,
        lat: 47.2115,
        lon: 18.7353,
        segment: {
          uphill: 900,
          downhill: 10,
          distance: 20,
          time: 38,
          score: 50
        }
      },
      {
        distanceFromOrigo: 200,
        onRoute: true,
        poiId: uuid(),
        lat: 47.2115,
        lon: 18.7353,
        segment: {
          uphill: 150,
          downhill: 10,
          distance: 400,
          time: 20,
          score: 60
        }
      },
      {
        distanceFromOrigo: 0,
        onRoute: true,
        poiId: 'endpoint-finish',
        lat: 47.7215,
        lon: 18.8753,
        isFinish: true,
        segment: {
          uphill: 500,
          downhill: 300,
          distance: 500,
          time: 58,
          score: 100
        }
      }
    ]
  },
  {
    id: uuid(),
    distance: 10,
    isRoundTrip: true,
    uphill: 20,
    downhill: 30,
    feature: true,
    time: 15,
    reverseTime: 15,
    score: 40,
    reverseScore: 40,
    location: 'London',
    difficulty: 1,
    routeIcon: '',
    elevationIcon: '',
    routeId: uuid(),
    description: {
      en_US: {
        fullDescription: 'Test hike desc 2',
        title: 'Test hike title 2',
        summary: 'Test hike summary 2'
      }
    },
    teaser: {
      en_US: {
        fullDescription: 'Test hike teaser 2',
        title: 'Test hike teaser title 2',
        summary: 'Test hike teaser summary 2'
      }
    },
    stops: [],
    reverseStops: []
  }
];

export const hikeProgramsStored: Array<HikeProgramStored> = [
  {
    ...hikePrograms[0],
    id: uuid(),
    timestamp: new Date().getTime(),
    state: EObjectState.draft
  },
  {
    ...hikePrograms[1],
    id: uuid(),
    timestamp: new Date().getTime(),
    state: EObjectState.draft
  }
];
