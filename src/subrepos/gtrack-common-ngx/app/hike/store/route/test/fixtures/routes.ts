import { IRoute, IRouteStored } from 'subrepos/provider-client';
import * as uuid from 'uuid/v4';

export const routes: IRoute[] = [
  {
    bounds: {
      NorthEast: {
        lat: 47.498993,
        lon: 19.043699
      },
      SouthWest: {
        lat: 47.497157,
        lon: 19.049757
      }
    },
    route: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Test'
          },
          geometry: {
            type: 'Point',
            coordinates: [
              18.95623999999998,
              47.57855,
              305.3887023925781
            ]
          }
        }
      ]
    }
  },
  {
    bounds: {
      NorthEast: {
        lat: 35.498993,
        lon: 15.043699
      },
      SouthWest: {
        lat: 35.497157,
        lon: 14.049757
      }
    },
    route: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Test2'
          },
          geometry: {
            type: 'Point',
            coordinates: [
              18.95623999999998,
              47.57855,
              305.3887023925781
            ]
          }
        },
        {
          type: 'Feature',
          properties: {
            name: 'Test3'
          },
          geometry: {
            type: 'Point',
            coordinates: [
              14.95623999999998,
              40.57855,
              25.3887023925781
            ]
          }
        }
      ]
    }
  },
];

export const routesStored: IRouteStored[] = [
  {
    ...routes[0],
    id: uuid(),
    timestamp: new Date().getTime()
  },
  {
    ...routes[1],
    id: uuid(),
    timestamp: new Date().getTime()
  }
]
