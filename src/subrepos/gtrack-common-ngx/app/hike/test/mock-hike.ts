export const mockHike = {
  description: {
    'en-US': {
      full: 'test',
      name: 'test',
      summary: 'test'
    }
  },
  distance: 11278,
  downhill: 177,
  elevationIcon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>',
  location: 'Budapest, HU',
  pois: [
    '1',
    '2',
  ],
  program: {
    isRoundTrip: true,
    pois: [
      {
        distanceFromOrigo: 6527.737211431297,
        isCheckPoint: true,
        poiId: '1',
        segment: {
          distance: 4750.751698152232,
          downhill: 85.10577392578125,
          score: 83,
          time: 69.3433559753631,
          uphill: 61.06315612792969
        }
      },
      {
        distanceFromOrigo: 4822.908881602028,
        isCheckPoint: true,
        poiId: '2',
        segment: {
          distance: 1704.8283298292686,
          downhill: 6.493087768554545,
          score: 31,
          time: 25.731044397723583,
          uphill: 27.522445678710824
        }
      }
    ]
  },
  score: 116,
  time: 165,
  routeIcon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>',
  routeId: '1',
  uphill: 153
};
