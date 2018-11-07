import { ETextualDescriptionType, EPoiTypes } from 'subrepos/provider-client';

export const OSM_NATURAL_RESPONSE = {
  version: 0.6,
  generator: 'Overpass API 0.7.55.4 3079d8ea',
  osm3s: {
    timestamp_osm_base: '2018-11-03T15:33:02Z',
    copyright:
      'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.'
  },
  elements: [
    {
      id: 3352546157,
      lat: 47.716533,
      lon: 18.780483,
      tags: {
        natural: 'spring',
        name: 'Studenka-forrás'
      }
    },
    {
      id: 3366556244,
      lat: 47.7054147,
      lon: 18.7338027,
      tags: {
        natural: 'peak',
        name: 'Arany-hegy'
      }
    },
    {
      id: 3454424651,
      lat: 47.695767,
      lon: 18.76825,
      tags: {
        natural: 'tree',
        name: 'Tölgyfa'
      }
    },
    // Trees without name will be trashed
    {
      id: 3454424651,
      lat: 47.695767,
      lon: 18.76825,
      tags: {
        natural: 'tree'
      }
    },
    // No tags - will be trashed
    {
      id: 3454424651,
      lat: 47.695767,
      lon: 18.76825
    }
  ]
};

export const OSM_NATURAL_POIS = [
  {
    id: '7c50ef80-df8a-11e8-b8d2-b5e47c8475da',
    lat: 47.716533,
    lon: 18.780483,
    types: ['spring'],
    description: {
      en_US: {
        title: 'Studenka-forrás',
        summary: '',
        fullDescription: '',
        type: ETextualDescriptionType.markdown,
      }
    },
    objectTypes: [EPoiTypes.osmNatural],
    elevation: undefined,
    osm: {
      id: 3352546157
    },
    selected: false
  },
  {
    id: '7c50ef81-df8a-11e8-b8d2-b5e47c8475da',
    lat: 47.7054147,
    lon: 18.7338027,
    types: ['peak'],
    description: {
      en_US: {
        title: 'Arany-hegy',
        summary: '',
        fullDescription: '',
        type: ETextualDescriptionType.markdown,
      }
    },
    objectTypes: [EPoiTypes.osmNatural],
    elevation: undefined,
    osm: {
      id: 3366556244
    },
    selected: false
  },
  {
    id: '7c511695-df8a-11e8-b8d2-b5e47c8475da',
    lat: 47.695767,
    lon: 18.76825,
    types: ['tree'],
    description: {
      en_US: {
        title: 'Tölgyfa',
        summary: '',
        fullDescription: '',
        type: ETextualDescriptionType.markdown,
      }
    },
    objectTypes: [EPoiTypes.osmNatural],
    elevation: undefined,
    osm: {
      id: 3454424651
    },
    selected: false
  }
];
