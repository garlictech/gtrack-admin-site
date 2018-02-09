import { IMockHikeElement } from '../shared/interfaces'

export const MOCK_HIKE_LIST: IMockHikeElement[] = [
  {
    'id': '-KYTgM_eoTk0BcbN8j5g',
    'description': {
      'hu_HU': {
        'fullDescription': '',
        'title': 'Első túra',
        'summary': ''
      }
    }
  },
  {
    'id': '-KYU-aTrD4mSxBG7ELZ9',
    'description': {
      'hu_HU': {
        'fullDescription': '',
        'title': 'Túra a Pilisben',
        'summary': ''
      }
    }
  },
  {
    'id': '-KhNoTDAUNykA_G0sPxN',
    'description': {
      'hu_HU': {
        'fullDescription': '',
        'title': 'Kerékpárral a Tisza-tó körül.',
        'summary': ''
      }
    }
  },
  {
    'id': '-KjD8OmAIRqSZDUzezjO',
    'description': {
      'hu_HU': {
        'fullDescription': '',
        'title': 'Tour de Balaton',
        'summary': ''
      }
    }
  },
  {
    'id': '-KjDDKHCwXzCj24bvGkJ',
    'description': {
      'hu_HU': {
        'fullDescription': '',
        'title': 'Dél-Alföldi túra',
        'summary': ''
      }
    }
  }
];

export const MOCK_HIKE_DATA: IMockHikeElement = {
  'id': '-KYTgM_eoTk0BcbN8j5g',
  'description': {
    'hu_HU': {
      'fullDescription': 'Első túra szép hosszú leírása',
      'title': 'Első túra',
      'summary': 'Első túra szép hosszú leírása nagyon hosszan. Mert ez a summary'
    },
    'en_US': {
      'fullDescription': '',
      'title': 'First hike with no EN description.',
      'summary': 'string'
    }
  }
};
