import { IMockHikeElement } from '../shared/interfaces'

export const MOCK_HIKE_LIST: IMockHikeElement[] = [
  {
    'id': '-KYTgM_eoTk0BcbN8j5g',
    'title': {
      'hu_HU': 'Első túra'
    }
  },
  {
    'id': '-KYU-aTrD4mSxBG7ELZ9',
    'title': {
      'hu_HU': 'Túra a Pilisben'
    }
  },
  {
    'id': '-KhNoTDAUNykA_G0sPxN',
    'title': {
      'hu_HU': 'Kerékpárral a Tisza-tó körül.'
    }
  },
  {
    'id': '-KjD8OmAIRqSZDUzezjO',
    'title': {
      'hu_HU': 'Tour de Balaton'
    }
  },
  {
    'id': '-KjDDKHCwXzCj24bvGkJ',
    'title': {
      'hu_HU': 'Dél-Alföldi túra'
    }
  }
];

export const MOCK_HIKE_DATA: IMockHikeElement = {
  'id': '-KYTgM_eoTk0BcbN8j5g',
  'description': {
    'hu_HU': {
      'full': 'Első túra szép hosszú leírása',
      'name': 'Első túra',
      'summary': 'Első túra szép hosszú leírása nagyon hosszan. Mert ez a summary'
    },
    'en_US': {
      'full': '',
      'name': 'First hike with no EN description.',
      'summary': 'string'
    }
  }
};
