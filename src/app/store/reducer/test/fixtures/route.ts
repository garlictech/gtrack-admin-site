const ROUTE_POINT = 'Route point';

export const route = {
  features: [
    {
      geometry: {
        coordinates: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
        type: 'LineString'
      },
      properties: {
        name: 'Tour track'
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [[0, 0]],
        type: 'Point'
      },
      properties: {
        name: ROUTE_POINT
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [[1, 1]],
        type: 'Point'
      },
      properties: {
        name: ROUTE_POINT
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [[2, 2]],
        type: 'Point'
      },
      properties: {
        name: ROUTE_POINT
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [[3, 3]],
        type: 'Point'
      },
      properties: {
        name: ROUTE_POINT
      },
      type: 'Feature'
    },
    {
      geometry: {
        coordinates: [[4, 4]],
        type: 'Point'
      },
      properties: {
        name: ROUTE_POINT
      },
      type: 'Feature'
    }
  ],
  type: 'FeatureCollection'
};

export const segments = [
  {
    distance: 17649,
    uphill: 394,
    downhill: 483,
    time: 274,
    score: 344,
    coords: [[0, 0], [1, 1]]
  },
  {
    distance: 27649,
    uphill: 394,
    downhill: 183,
    time: 270,
    score: 102,
    coords: [[10, 0], [11, 1]]
  }
];
