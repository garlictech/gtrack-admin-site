// tslint:disable:max-line-length

import { EPoiTypes, ETextualDescriptionType } from 'subrepos/provider-client';

export const WIKIPEDIA_RESPONSE = {
  batchcomplete: '',
  query: {
    geosearch: [
      {
        pageid: 11185321,
        ns: 0,
        title: 'Piliscsév',
        lat: 47.6771,
        lon: 18.81489,
        dist: 2430.8,
        primary: ''
      },
      {
        pageid: 11185287,
        ns: 0,
        title: 'Leányvár',
        lat: 47.68268,
        lon: 18.7702,
        dist: 1282.5,
        primary: ''
      },
      {
        pageid: 17297227,
        ns: 0,
        title: 'Pilisjászfalu',
        lat: 47.654721,
        lon: 18.795279,
        dist: 2418.9,
        primary: ''
      }
    ]
  }
};

export const WIKIPEDIA_POIS = [
  {
    id: '1',
    description: {
      en_US: {
        fullDescription: '',
        summary: '',
        title: 'Piliscsév',
        type: ETextualDescriptionType.markdown
      }
    },
    elevation: 0,
    lat: 47.6771,
    lon: 18.81489,
    objectTypes: [EPoiTypes.wikipedia],
    selected: false,
    types: ['sight'],
    wikipedia: {
      lng: 'en',
      pageid: 11185321,
      url: 'https://en.wikipedia.org/?curid=11185321'
    }
  },
  {
    id: '2',
    description: {
      en_US: {
        fullDescription: '',
        summary: '',
        title: 'Leányvár',
        type: ETextualDescriptionType.markdown
      }
    },
    elevation: 0,
    lat: 47.68268,
    lon: 18.7702,
    objectTypes: [EPoiTypes.wikipedia],
    selected: false,
    types: ['sight'],
    wikipedia: {
      lng: 'en',
      pageid: 11185287,
      url: 'https://en.wikipedia.org/?curid=11185287'
    }
  },
  {
    id: '3',
    description: {
      en_US: {
        fullDescription: '',
        summary: '',
        title: 'Pilisjászfalu',
        type: ETextualDescriptionType.markdown
      }
    },
    elevation: 0,
    lat: 47.654721,
    lon: 18.795279,
    objectTypes: [EPoiTypes.wikipedia],
    selected: false,
    types: ['sight'],
    wikipedia: {
      lng: 'en',
      pageid: 17297227,
      url: 'https://en.wikipedia.org/?curid=17297227'
    }
  }
];

export const WIKIPEDIA_POI_EXTRACT = {
  batchcomplete: '',
  query: {
    pages: {
      '11185321': {
        pageid: 11185321,
        ns: 0,
        title: 'Piliscsév',
        extract: 'Piliscsév (Slovak: Čív) is a village in Komárom-Esztergom county, Hungary.'
      }
    }
  },
  limits: {
    extracts: 20
  }
};

export const WIKIPEDIA_POI_IMAGE = {
  batchcomplete: '',
  query: {
    pages: {
      '11185321': {
        pageid: 11185321,
        ns: 0,
        title: 'Pomáz',
        thumbnail: {
          source:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Teleki-kast%C3%A9ly_%287250._sz%C3%A1m%C3%BA_m%C5%B1eml%C3%A9k%29_4.jpg/33px-Teleki-kast%C3%A9ly_%287250._sz%C3%A1m%C3%BA_m%C5%B1eml%C3%A9k%29_4.jpg',
          width: 33,
          height: 50
        },
        original: {
          source:
            'https://upload.wikimedia.org/wikipedia/commons/9/9d/Teleki-kast%C3%A9ly_%287250._sz%C3%A1m%C3%BA_m%C5%B1eml%C3%A9k%29_4.jpg',
          width: 1071,
          height: 1600
        },
        pageimage: 'Teleki-kastély_(7250._számú_műemlék)_4.jpg'
      }
    }
  }
};

// tslint:enable:max-line-length
