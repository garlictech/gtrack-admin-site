import { ETextualDescriptionType, EPoiTypes } from 'subrepos/provider-client';

export const OSM_AMENITY_RESPONSE = {
  version: 0.6,
  generator: 'Overpass API 0.7.55.4 3079d8ea',
  osm3s: {
    timestamp_osm_base: '2018-11-03T15:33:02Z',
    copyright:
      'The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.'
  },
  elements: [
    {
      type: 'node',
      id: 3454423964,
      lat: 47.670135,
      lon: 18.861173,
      tags: {
        amenity: 'game_feeding',
        source: 'turistautak.hu',
        'source:date': '2014-02-06',
        url: 'http://turistautak.hu/poi.php?id=8289'
      }
    },
    {
      type: 'node',
      id: 3461931211,
      lat: 47.682217,
      lon: 18.859733,
      tags: {
        amenity: 'hunting_stand',
        description: 'Magasles a sárga+ jelzés mentén.',
        source: 'turistautak.hu',
        'source:date': '2014-02-06',
        url: 'http://turistautak.hu/poi.php?id=7014'
      }
    },
    {
      type: 'node',
      id: 4807753979,
      lat: 47.678501,
      lon: 18.859491,
      tags: {
        amenity: 'hunting_stand'
      }
    },
    {
      type: 'node',
      id: 4807753980,
      lat: 47.6718973,
      lon: 18.8647884,
      tags: {
        amenity: 'hunting_stand'
      }
    }
  ]
};

export const OSM_AMENITY_POIS = [
  {
    description: {
      en_US: {
        fullDescription: '',
        summary: '',
        title: 'Game feeding',
        type: ETextualDescriptionType.markdown,
      }
    },
    elevation: undefined,
    id: '69bfb720-df80-11e8-8d02-d5cc2cec59b6',
    lat: 47.670135,
    lon: 18.861173,
    objectTypes: [EPoiTypes.osmAmenity],
    osm: {
      id: 3454423964
    },
    selected: false,
    types: ['game_feeding']
  },
  {
    description: {
      en_US: {
        fullDescription: '',
        summary: '',
        title: 'Hunting stand',
        type: ETextualDescriptionType.markdown,
      }
    },
    elevation: undefined,
    id: '69bfb721-df80-11e8-8d02-d5cc2cec59b6',
    lat: 47.682217,
    lon: 18.859733,
    objectTypes: [EPoiTypes.osmAmenity],
    osm: {
      id: 3461931211
    },
    selected: false,
    types: ['hunting_stand']
  },
  {
    description: {
      en_US: {
        fullDescription: '',
        summary: '',
        title: 'Hunting stand',
        type: ETextualDescriptionType.markdown,
      }
    },
    elevation: undefined,
    id: '69bfb722-df80-11e8-8d02-d5cc2cec59b6',
    lat: 47.678501,
    lon: 18.859491,
    objectTypes: [EPoiTypes.osmAmenity],
    osm: {
      id: 4807753979
    },
    selected: false,
    types: ['hunting_stand']
  },
  {
    description: {
      en_US: {
        fullDescription: '',
        summary: '',
        title: 'Hunting stand',
        type: ETextualDescriptionType.markdown,
      }
    },
    elevation: undefined,
    id: '69bfde30-df80-11e8-8d02-d5cc2cec59b6',
    lat: 47.6718973,
    lon: 18.8647884,
    objectTypes: [EPoiTypes.osmAmenity],
    osm: {
      id: 4807753980
    },
    selected: false,
    types: ['hunting_stand']
  }
];
