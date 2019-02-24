import { ETextualDescriptionType, IHikeProgram } from 'subrepos/provider-client';
import * as uuid from 'uuid/v4';

export const hikePrograms: Array<IHikeProgram> = [
  {
    id: uuid(),
    distance: 5,
    isRoundTrip: false,
    uphill: 1,
    downhill: 1,
    time: 20,
    reverseTime: 200,
    score: 20,
    reverseScore: 20,
    location: 'Budapest',
    difficulty: 5,
    feature: true,
    routeIcon: '',
    elevationIcon: '',
    routeId: uuid(),
    description: {
      en_US: {
        fullDescription: 'Test hike description',
        title: 'Test hike title',
        summary: 'Test hike summary',
        type: ETextualDescriptionType.markdown
      }
    },
    stops: [],
    reverseStops: []
  },
  {
    id: uuid(),
    distance: 10,
    isRoundTrip: true,
    uphill: 20,
    downhill: 30,
    time: 15,
    reverseTime: 100,
    score: 40,
    reverseScore: 400,
    location: 'London',
    difficulty: 1,
    feature: true,
    routeIcon: '',
    elevationIcon: '',
    routeId: uuid(),
    description: {
      en_US: {
        fullDescription: 'Test hike description 2',
        title: 'Test hike title 2',
        summary: 'Test hike summary 2',
        type: ETextualDescriptionType.markdown
      }
    },
    stops: [],
    reverseStops: []
  }
];
